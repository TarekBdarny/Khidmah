"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { LucideIcon, Search } from "lucide-react";
import { Textarea } from "../ui/textarea";
type Props = {
  labelValue: string;
  inputType: string;
  placeholder?: string;
  id: string;
  setterStringFunction?: (value: string) => void;
  setterNumberFunction?: (value: number) => void;
  Icon?: LucideIcon;
  textArea?: boolean;
};
const InputWithLabel = ({
  labelValue,
  setterStringFunction,
  setterNumberFunction,
  id,
  Icon,
  inputType,
  placeholder,
  textArea,
}: Props) => {
  return setterNumberFunction || setterStringFunction ? (
    <div className="relative ">
      <input
        type={inputType}
        id={id}
        placeholder={placeholder ? placeholder : ""}
        className={`
          peer h-12  ${
            Icon ? "px-10" : "px-4"
          } bg-transparent border-2 outline-none focus:border-primary w-full rounded-md
          `}
        onChange={(e) =>
          setterStringFunction
            ? setterStringFunction(e.target.value)
            : setterNumberFunction &&
              setterNumberFunction(Number(e.target.value))
        }
      />

      <label
        htmlFor={id}
        className={`
            
            
            absolute ${Icon ? "right-10" : "right-4"} top-3 text-gray-500 
            transition-all duration-200 pointer-events-none 
            bg-background px-1
            peer-placeholder-shown:top-3 
            peer-placeholder-shown:text-base 
            peer-focus:-top-2 peer-focus:text-xs
            peer-focus:text-primary
            
            peer-not-placeholder-shown:-top-2 
            peer-not-placeholder-shown:text-xs
            `}
      >
        {labelValue}
      </label>
      {Icon && (
        <Icon className="absolute  right-4 top-1/2 -translate-y-1/2 size-4 " />
      )}
    </div>
  ) : (
    <div className="relative ">
      <input
        type={inputType}
        id={id}
        placeholder={placeholder ? placeholder : ""}
        className={`
          peer h-12  ${
            Icon ? "px-10" : "px-4"
          } bg-transparent border-2 outline-none focus:border-primary w-full rounded-md
          `}
      />

      <label
        htmlFor={id}
        className={`
            
            
            absolute ${Icon ? "right-10" : "right-4"} top-3 text-gray-500 
            transition-all duration-200 pointer-events-none 
            bg-background px-1
            peer-placeholder-shown:top-3 
            peer-placeholder-shown:text-base 
            peer-focus:-top-2 peer-focus:text-xs
            peer-focus:text-primary
            
            peer-not-placeholder-shown:-top-2 
            peer-not-placeholder-shown:text-xs
            `}
      >
        {labelValue}
      </label>
      {Icon && (
        <Icon className="absolute  right-4 top-1/2 -translate-y-1/2 size-4 " />
      )}
    </div>
  );
};

export default InputWithLabel;
