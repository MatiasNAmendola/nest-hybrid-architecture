import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Length, Validate } from 'class-validator-multi-lang';
import { passwordRequirement, PasswordValidation } from '../../../validations';

export class ResetPasswordDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 50)
  username: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(5, 20)
  code: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(10, 50)
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;

  constructor({ username, code, password }: any = {}) {
    this.username = username;
    this.code = code;
    this.password = password;
  }
}
