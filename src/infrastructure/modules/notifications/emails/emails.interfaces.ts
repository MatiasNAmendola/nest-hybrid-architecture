import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EmailsOptions } from '../../../config';

export interface EmailsOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => EmailsOptions | Promise<EmailsOptions>;
  inject?: any[];
}

export interface EmailMessageData {
  To: [
    {
      Email: string;
      Name: string;
    },
  ];
  Subject: string;
  TextPart: string;
  HTMLPart: string;
}
