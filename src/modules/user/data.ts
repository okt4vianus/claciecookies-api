import { User } from "~/generated/prisma";

// export type CreateUser = User;
// export type CreateUser = Pick<User, "fullName" | "username" | "email"> & {
//   password: string;
// };

export type CreateUser = Pick<User, "fullName" | "username" | "email"> & {
  password: string;
};

export type UpdateUser = Partial<User>;

// Single user
export const dataUser: CreateUser = {
  fullName: "John Doe",
  username: "johndoe",
  email: "john.doe@claciecookies.com",
  password: "placeholder",
};

// Multiple users for seeding
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
