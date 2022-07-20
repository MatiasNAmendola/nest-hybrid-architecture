import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Length, MinLength } from 'class-validator-multi-lang';

export class UpdatePaymentDataDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @Length(6, 50)
  username: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString()
  @MinLength(6)
  paymentsCustomerId: string;

  constructor({ username, paymentsCustomerId }: any = {}) {
    this.username = username;
    this.paymentsCustomerId = paymentsCustomerId;
  }
}
