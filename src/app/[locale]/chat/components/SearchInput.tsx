import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
type SearchInputProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  id: string;
  placeholder: string;
};
const SearchInput = ({
  searchTerm,
  setSearchTerm,
  label,
  id,
  placeholder,
}: SearchInputProps) => {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input
        value={searchTerm}
        id={id}
        name="label"
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </>
  );
};

export default SearchInput;
