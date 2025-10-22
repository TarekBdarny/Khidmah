type ToolBarProps = {
  order: "asc" | "desc";
  setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  length: number | undefined;
  setSearchedCompany: React.Dispatch<React.SetStateAction<string>>;
};
interface User {
  id: string;
  firstName: string;
  lastName: string;
}
type RequestCardProps = {
  companyName: string | null;
  id: string;
  user: User;
  yearsExperience: string | null;
  maxWorkDistance: string | null;
  areasOfExperience: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  startTime: string;
  endTime: string;
  offDays: string[];
  attachments: Attachments[];
  message?: string | null;
};
type RequestFieldItem = {
  label: string;
  value: string | null;
  children?: React.ReactNode;
};
type Attachments = Pick<
  DatabaseAttachment,
  "id" | "urlPath" | "fileType" | "name" | "size"
>;
interface DatabaseAttachment {
  id: string;
  userId: string;
  publicId: string;
  requestId: string;
  name: string;
  urlPath: string;
  fileType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}
type StatusSelectProps = {
  status: "PENDING" | "APPROVED" | "REJECTED" | "ALL";
  setStatus: React.Dispatch<
    React.SetStateAction<"PENDING" | "APPROVED" | "REJECTED" | "ALL">
  >;
};

type Roles = "ADMIN" | "WORKER" | "CLIENT";
// type DropDownMenuProps = {
//   label: string;
//   menuContent: Cities | DropDownCategory[] | undefined;
//   notFoundText: string;
//   inputPlaceHolder: string;
// };
type DropDownCategory = {
  name: string;
  id: string;
  description: string | null;
  language: string;
  categoryId: string;
};
type DropDownItem = {
  name: string;
  id: string;
  description: string | null;
  language: string;
  categoryId: string;
};

type CategoriesDropDownProps = {
  label: string;
  categoriesArray: DropDownCategory[] | undefined;
  notFoundText: string;
  inputPlaceHolder: string;
  categoriesValues: string;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setCategoriesValues: React.Dispatch<React.SetStateAction<string>>;
};
type CitiesDropDownProps = {
  label: string;
  cities: string[];
  notFoundText: string;
  inputPlaceHolder: string;
  handleSelectCity: (city: string) => void;
  citiesValue: string;
  setCitiesValue: React.Dispatch<React.SetStateAction<string>>;
  // handleRest: () => void;
};
type Cities = string[];
type FilterBarProps = {
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  setSelectStatus: React.Dispatch<React.SetStateAction<string>>;
  handleReset: () => void;
  reset: boolean;
  citiesValue: string;
  selectStatus: string;
  results: number | undefined;
  setCitiesValue: React.Dispatch<React.SetStateAction<string>>;
  categoriesValues: string;
  setCategoriesValues: React.Dispatch<React.SetStateAction<string>>;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
};
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
      verified?: boolean;
    };
  }
}
