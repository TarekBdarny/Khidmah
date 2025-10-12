import React from "react";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

const NavbarWrapper = () => {
  return (
    <div className="">
      <div className="hidden lg:block">
        <DesktopNavbar />
      </div>
      <div className="block lg:hidden">
        <MobileNavbar />
      </div>
    </div>
  );
};

export default NavbarWrapper;
