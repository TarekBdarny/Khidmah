import React from "react";

type Props = {
  children: React.ReactNode;
};
const GridContainer = ({ children }: Props) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-6 max-w-[1400px] mx-auto my-0
  "
    >
      {children}
    </div>
  );
};

export default GridContainer;
