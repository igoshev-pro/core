export enum UserRole {
  User = "user",
  Admin = "admin",
  SuperAdmin = "superAdmin",
}

export const getUserRoleString = (user: any) => {
  switch (user.role) {
    case UserRole.Admin:
      return "Администратор";
    case UserRole.SuperAdmin:
      return "Суперадминистратор";
    default:
      return "Пользователь";
  }
};
