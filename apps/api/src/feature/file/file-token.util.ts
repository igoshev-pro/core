import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FileTokenUtil {
  constructor(private readonly jwtService: JwtService) {}

  generateFileToken(fileId: string, ownerId: string): string {
    return this.jwtService.sign(
      { fileId, ownerId },
      { expiresIn: '100y' }, // срок действия токена файла
    );
  }

  verifyFileToken(token: string): { fileId: string; ownerId: string } {
    return this.jwtService.verify(token);
  }
}
