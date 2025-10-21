"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { checkRole, checkVerified } from "../../utils/roles";
import { success } from "zod";

export async function setRole(role: Role, userId: string) {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkRole("ADMIN")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: role },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function removeRole(role: Role) {
  const { userId } = await auth();
  if (!userId) return;
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: role },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}
export async function setVerified(verified: boolean, userId: string) {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkVerified()) {
    return { message: "Not Verified!", success: false };
  }

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { verified: true },
    });
    return { message: res.publicMetadata, success: true };
  } catch (err) {
    return { message: err, success: false };
  }
}
export async function setNotVerified(userId: string) {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkVerified()) {
    return { message: "Not Verified!" };
  }

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { verified: false },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}
