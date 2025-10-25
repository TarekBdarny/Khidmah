import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Image, Send } from "lucide-react";
import { send } from "process";
import React from "react";
interface ChatFormProps {
  sendNewMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}
const ChatForm = ({
  sendNewMessage,
  setNewMessage,
  isLoading,
  newMessage,
}: ChatFormProps) => {
  return (
    <form className="flex   bg-background border-t ">
      <div className="flex w-full p-4 space-x-2">
        <Button variant={"ghost"} type="button">
          <Image className="flex-1" />
          <span className="sr-only">upload image</span>
        </Button>
        <Input
          placeholder="Send a message"
          className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 text-sm"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <Button
          variant={"action"}
          onClick={sendNewMessage}
          disabled={isLoading || newMessage.trim() === ""}
          type="submit"
        >
          {isLoading ? <Spinner /> : <Send />}
          <span className="sr-only">send message</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatForm;
