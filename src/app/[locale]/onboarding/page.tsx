"use client";
import { updateUserInfo } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const page = () => {
  const [data, setData] = useState({
    city: "",
    phoneNumber: "",
    age: 0,
  });

  const handleUpdate = async () => {
    try {
      const res = await updateUserInfo(data);
      if (!res?.success) {
        console.log("Failed to update user");
        return;
      }
      //TODO: navigate to the home page or profile page
    } catch (error) {}
  };
  return (
    <div>
      <p>city</p>
      <input
        type="text"
        onChange={(e) => setData({ ...data, city: e.target.value })}
      />
      <p>phone number</p>
      <input
        type="text"
        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
      />
      <p>age</p>
      <input
        type="number"
        min={4}
        max={100}
        onChange={(e) => setData({ ...data, age: +e.target.value })}
      />
      <Button onClick={handleUpdate}>Update</Button>
    </div>
  );
};

export default page;
