import { Address, User } from "~/generated/prisma";

// export type CreateUser = User;
// export type CreateUser = Pick<User, "name" | "username" | "email"> & {
//   password: string;
// };

export type SeedUser = Pick<
  User,
  "name" | "username" | "email" | "phoneNumber"
> & {
  password: string;
};

export type UpdateUser = Partial<User>;

// Multiple users for seeding
export const dataSeedUsers: SeedUser[] = [
  {
    name: "Admin",
    username: "admin",
    email: "admin@claciecookies.com",
    password: "placeholder",
    phoneNumber: null,
  },
  {
    name: "Clacie",
    username: "clacie",
    email: "clacie@claciecookies.com",
    password: "placeholder",
    phoneNumber: "081111111111",
  },
  {
    name: "Oktav",
    username: "oktav",
    email: "oktav@claciecookies.com",
    password: "placeholder",
    phoneNumber: "082222222222",
  },
];

export type CreateAddress = Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt"
> & {
  userEmail: string; // Will use email to find the user
};

// Address data for seeding
export const dataAddresses: CreateAddress[] = [
  // Admin user - 0 addresses (no addresses)

  // Clacie user - 1 address
  {
    userEmail: "clacie@claciecookies.com",
    label: "Rumah",
    recipientName: "Clacie",
    phoneNumber: "+62812345678902",
    street: "Jl. Sam Ratulangi No. 88",
    city: "Manado",
    province: "Sulawesi Utara",
    postalCode: "95115",
    country: "Indonesia",
    landmark: "Dekat Universitas Sam Ratulangi",
    notes: "Rumah cat hijau, pagar putih",
    latitude: 1.4556,
    longitude: 124.8453,
    isDefault: true,
    isActive: true,
  },

  // Oktav user - 2 addresses
  {
    userEmail: "oktav@claciecookies.com",
    label: "Rumah",
    recipientName: "Oktav",
    phoneNumber: "+62812345678904",
    street: "Jl. Raya Tomohon No. 45",
    city: "Tomohon",
    province: "Sulawesi Utara",
    postalCode: "95416",
    country: "Indonesia",
    landmark: "Dekat Pasar Beriman Tomohon",
    notes: "Rumah 2 lantai warna krem",
    latitude: 1.328,
    longitude: 124.8378,
    isDefault: true,
    isActive: true,
  },
  {
    userEmail: "oktav@claciecookies.com",
    label: "Kantor",
    recipientName: "Oktav - PT Minahasa Digital",
    phoneNumber: "+62812345678905",
    street: "Jl. Diponegoro No. 12",
    city: "Manado",
    province: "Sulawesi Utara",
    postalCode: "95113",
    country: "Indonesia",
    landmark: "Gedung Kantor Lt. 2",
    notes: "Kompleks perkantoran, gedung C lantai 2",
    latitude: 1.4822,
    longitude: 124.8456,
    isDefault: false,
    isActive: true,
  },
];
