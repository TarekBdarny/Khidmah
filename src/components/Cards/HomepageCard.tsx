import React from "react";
type CategoryCardProps = {
  category: {
    engName: string;
    usedName: string;
    icon: string;
    description: string;
  };
};
const HomepageCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="p-8  rounded-lg text-center cursor-pointer transition-all border-1 hover:-translate-y-1 hover:shadow-sm hover:shadow-primary hover:border-primary ">
      <div className="mb-4 text-4xl">{category.icon}</div>
      <h3 className="mb-2 text-xl">{category.usedName}</h3>
      <p className="text-[0.9rem] text-[#808080]">{category.description}</p>
    </div>
  );
};

export default HomepageCard;
