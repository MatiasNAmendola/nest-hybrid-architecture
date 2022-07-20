import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Length, Validate } from 'class-validator-multi-lang';
import { passwordRequirement, PasswordValidation } from '../../../validations';

export class LoginDTO {
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

  constructor({ username, password }: any = {}) {
    this.username = username;
    this.password = password;
  }
}
