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
