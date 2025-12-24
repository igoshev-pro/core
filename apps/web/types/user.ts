import type { Currency } from "./common";

export interface User {
  name: string;
  email: string;
  otp?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  balance?: UserBalance[];
  currentCurrency: Currency;
}

export type UserBalance = {
  balance: number;
  currency: Currency;
};

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Draft = "draft",
  Archived = "archived",
}

export enum UserRole {
  User = "user",
  Admin = "admin",
  SuperAdmin = "superAdmin",
}
