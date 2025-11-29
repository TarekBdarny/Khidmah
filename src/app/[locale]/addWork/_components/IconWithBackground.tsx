import { IconNode, LucideIcon } from "lucide-react";
import React from "react";
type IconWithBackgroundProps = {
  backgroundColor: string;
  Icon: React.ReactNode;
  size?: number;
};

const IconWithBackground = ({
  backgroundColor,
  Icon,
  size = 9,
}: IconWithBackgroundProps) => {
  return (
    <div
      className={`size-${size} ${backgroundColor} rounded-lg flex items-center justify-center p-2`}
    >
      {Icon}
    </div>
  );
};

export default IconWithBackground;
