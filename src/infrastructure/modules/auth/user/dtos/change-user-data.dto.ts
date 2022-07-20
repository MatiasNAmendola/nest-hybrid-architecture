import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, Length } from 'class-validator-multi-lang';

export class ChangeUserDataDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 50)
  username: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 70)
  fullName: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsEmail()
  @Length(6, 100)
  email: string;

  constructor({ username, fullName, email }: any = {}) {
    this.username = username;
    this.fullName = fullName;
    this.email = email;
  }
}
