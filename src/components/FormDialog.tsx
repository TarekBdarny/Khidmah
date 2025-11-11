"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Textarea } from "./ui/textarea";
import React from "react";
interface FormDialogProps {
  handleContinueClick: () => void;
  setValue?: () => void;
}
export function WhyYouWantToWorkWithUsDialog({
  handleContinueClick,
  setValue,
}: FormDialogProps) {
  const t = useTranslations("BecomeWorkerForm");
  const [messageValue, setMessageValue] = React.useState("");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setMessageValue(value);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"action"}
          form="request-form"
          onClick={handleContinueClick}
        >
          Continue
          {/* <Send /> */}
          <span className="sr-only"> {t("submit")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Why do you want to work with us?</DialogTitle>
          <DialogDescription>
            please provide a reason why you want to work with us (optional)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3 relative">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              onChange={(e) => handleChange(e)}
              rows={5}
              cols={10}
              value={messageValue}
              className="w-full resize-none rounded-lg pb-8 border "
              // defaultValue="Your website seems a good chance to earn more money"
            />
            <p className="text-xs  absolute right-2 bottom-2">
              <span
                className={`${
                  messageValue.length > 140 ? "text-red-500" : "text-primary"
                }`}
              >
                {messageValue.length}
              </span>
              /150{" "}
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" variant={"action"} form="request-form">
            {t("submit")}
            <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
