"use client";
import InputWitLabel from "@/components/reuseable/InputWithLabel";
import React from "react";

const page = () => {
  const [email, setEmail] = React.useState<string>("");
  const setterFunction = (value: string) => {
    setEmail(value);
  };
  return (
    <div className="w-xl">
      <InputWitLabel
        labelValue="Enter Your Email"
        inputType="email"
        id="email-input"
        setterFunction={setterFunction}
      />
      <p>Email: {email}</p>
    </div>
  );
};

export default page;
