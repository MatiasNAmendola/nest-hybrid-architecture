import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, Length, Validate } from 'class-validator-multi-lang';
import { passwordRequirement, PasswordValidation } from '../../../validations';

export class RegisterUserDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 50)
  username: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(10, 50)
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;

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

  constructor({ username, password, fullName, email }: any = {}) {
    this.username = username;
    this.password = password;
    this.fullName = fullName;
    this.email = email;
  }
}
