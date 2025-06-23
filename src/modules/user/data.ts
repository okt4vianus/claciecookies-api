import { User } from "~/generated/prisma";

export type CreateUser = Pick<User, "fullName" | "username" | "email"> & {
  password: string;
};

export type UpdateUser = Partial<User>;

export const dataUsers: CreateUser[] = [
  {
    fullName: "Admin",
    username: "admin",
    email: "admin@claciecookies.com",
    password: "placeholder",
  },
  {
    fullName: "Clacie",
    username: "clacie",
    email: "clacie@claciecookies.com",
    password: "placeholder",
  },
  {
    fullName: "Oktav",
    username: "oktav",
    email: "oktav@claciecookies.com",
    password: "placeholder",
  },
];
