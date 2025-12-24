export class CreateClientDto {
  name: string;
  email: string;
  otp?: string;
  avatarPath?: string;
  photos?: any[]
}
