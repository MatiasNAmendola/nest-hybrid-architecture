import { IsUUID } from 'class-validator-multi-lang';

export class FindByIdParam {
  @IsUUID('4')
  id: string;
}
