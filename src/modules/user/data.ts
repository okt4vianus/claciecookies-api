export type User = {
  username: string;
  email: string;
  fullName: string;
};

export type CreateUser = User;
export type UpdateUser = Partial<User>;

// Single user
export const dataUser: CreateUser = {
  username: "johndoe",
  email: "john.doe@gmail.com",
  fullName: "John Doe",
};

// Multiple users for seeding
export const dataUsers: CreateUser[] = [
  {
    username: "johndoe",
    email: "john.doe@gmail.com",
    fullName: "John Doe",
  },
  {
    username: "janedoe",
    email: "jane.doe@yahoo.com",
    fullName: "Jane Doe",
  },
  {
    username: "mikejohnson",
    email: "mike.johnson@outlook.com",
    fullName: "Mike Johnson",
  },
  {
    username: "sarahwilson",
    email: "sarah.wilson@gmail.com",
    fullName: "Sarah Wilson",
  },
  {
    username: "davidbrown",
    email: "david.brown@hotmail.com",
    fullName: "David Brown",
  },
];
