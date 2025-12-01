import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";
type BadgeProps = {
  category: string;
  handleRemoveCategory: (category: string) => void;
};
const CategoryBadge = ({ category, handleRemoveCategory }: BadgeProps) => {
  return (
    <Badge
      variant={"outline"}
      className="px-3 flex justify-between items-center"
    >
      <span>{category}</span>
      <Button
        type="button"
        variant={"ghost"}
        className="rounded-full hover:scale-105 hover:text-primary transition-all bg-transparent"
        size={"icon-sm"}
        onClick={() => handleRemoveCategory(category)}
      >
        <X className="size-3 " />
      </Button>
    </Badge>
  );
};

export default CategoryBadge;
