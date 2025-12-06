"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { applyToWorkPost } from "@/actions/workPost.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ApplyDialogProps {
  postId: string;
  postPayment: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ApplyDialog({
  postId,
  postPayment,
  trigger,
  onSuccess,
}: ApplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState<string>(
    postPayment > 0 ? postPayment.toString() : ""
  );
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      const proposedPrice = price ? parseFloat(price) : undefined;
      const result = await applyToWorkPost(postId, proposedPrice);
      if (result.success) {
        toast.success("Applied successfully!");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to apply");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Apply Now</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for this Job</DialogTitle>
          <DialogDescription>
            {postPayment > 0
              ? `The client has set a payment of ${postPayment}. You can confirm or propose a different price.`
              : "The client hasn't set a price. Please propose your price for this job."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
              placeholder="Enter your price"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleApply} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
