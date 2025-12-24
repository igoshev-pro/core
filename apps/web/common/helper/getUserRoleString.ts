export enum UserRole {
  User = "user",
  Client = "client",
  SuperAdmin = "superAdmin",
}

export const getUserRoleString = (user: any) => {
  switch (user.role) {
    case UserRole.Client:
      return "Клиент";
    case UserRole.SuperAdmin:
      return "Суперадминистратор";
    default:
      return "Пользователь";
  }
};
