import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Length, Validate } from 'class-validator-multi-lang';
import { passwordRequirement, PasswordValidation } from '../../../validations';

export class ChangePasswordDTO {
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
  oldPassword: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(10, 50)
  @Validate(PasswordValidation, [passwordRequirement])
  newPassword: string;

  constructor({ username, oldPassword, newPassword }: any = {}) {
    this.username = username;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}
