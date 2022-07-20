import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator-multi-lang';

export class RequestUsernameDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsEmail()
  email: string;

  constructor({ email }: any = {}) {
    this.email = email;
  }
}
