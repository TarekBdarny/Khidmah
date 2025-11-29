// app/api/upload/route.ts
// import { NextRequest, NextResponse } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { getAuthUser, getLoggedUserId } from "@/actions/user.action";
import { getExtension } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const userId = await getLoggedUserId();
    if (!userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    // Validate file count
    if (files.length === 0 || files.length > 3) {
      return NextResponse.json(
        { error: "Please upload between 1 and 3 files" },
        { status: 400 }
      );
    }
    const workPost = await prisma.workPost.findFirst({
      where: {
        clientId: userId,
      },
    });
    if (!workPost)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    // Upload files to Cloudinary and save to database
    const uploadPromises = files.map(async (file) => {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Determine resource type
      const isImage = file.type.startsWith("image/");
      const resourceType = isImage ? "image" : "raw";
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: resourceType,
              folder: "posts", // Optional: organize in folders
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });
      // Save to database
      const attachment = await prisma.attachment.create({
        data: {
          userId: userId,
          urlPath: result.secure_url,
          publicId: result.public_id,
          fileType: isImage ? "image" : "pdf",
          postId: workPost.id,
          name: file.name,
          size: file.size,
        },
      });

      return attachment;
    });

    const attachments = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      attachments,
    });
  } catch (error) {
    console.error("=== Upload error ===");
    console.error("Error details:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to remove attachments
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getLoggedUserId();
    const { id } = await request.json();
    if (!userId) return;
    const attachments = await prisma.attachment.findMany({
      where: { userId },
    });
    if (!attachments) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }
    attachments.map(async (attachment) => {
      const resourceType = attachment.fileType === "image" ? "image" : "raw";
      await cloudinary.uploader.destroy(attachment.publicId, {
        resource_type: resourceType,
      });
      await prisma.attachment.delete({
        where: { id: attachment.id },
      });
    });
    return NextResponse.json({
      success: true,
      message: "Attachments deleted",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete attachments" },
      { status: 500 }
    );
  }
}
