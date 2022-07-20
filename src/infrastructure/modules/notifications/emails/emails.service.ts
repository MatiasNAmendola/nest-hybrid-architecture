import { Injectable, Inject } from '@nestjs/common';
import Mailjet from 'node-mailjet';
import Client from 'node-mailjet/declarations/client';
import merge from 'lodash.merge';
import md5 from 'md5';
import { EMAILS_CONFIGURATION } from './emails.constants';
import { EmailsOptions } from '../../../config';
import { EmailMessageData } from './emails.interfaces';
import { ISSUER } from '../../../helpers';
import { UserAvailable } from '../../auth';

type BasicMetadata = { Subject: string; TextPart: string };
type Attachment = { ContentType: string; Filename: string; ContentID: string; Base64Content: string };
const PREFIX = 'Company.x | ';
type BasicData = Omit<EmailMessageData, 'Subject' | 'TextPart'>;
type Message = { lang: string; title: string; subtitle: string; content: string; user: UserAvailable };

@Injectable()
export class EmailsService {
  private readonly mailjet: Client;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(@Inject(EMAILS_CONFIGURATION) private readonly configuration: EmailsOptions) {
    this.mailjet = Mailjet.apiConnect(configuration.apiKey, configuration.apiSecret);
    this.fromEmail = configuration.fromEmail;
    this.fromName = configuration.fromName;
  }

  public async sendLoggedIn(lang: string, user: UserAvailable, ip: string): Promise<void> {
    const { email: Email, fullName: Name } = user;
    const metadata = EmailsService.buildLoggedInMetadata(lang, ip);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildLoggedInMessage(lang, user, ip, metadata),
    };

    await this.sendEmail(data, metadata);
  }

  public async sendConfirmationEmail(lang: string, user: UserAvailable, code: string): Promise<void> {
    const { email: Email, fullName: Name } = user;
    const metadata = EmailsService.buildConfirmationEmailMetadata(lang, code);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildConfirmationEmailMessage(lang, user, metadata),
    };

    await this.sendEmail(data, metadata);
  }

  public async sendConfirmedEmail(lang: string, user: UserAvailable): Promise<void> {
    const { email: Email, fullName: Name } = user;
    const metadata = EmailsService.buildConfirmedEmailMetadata(lang);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildConfirmedEmailMessage(lang, user, metadata),
    };

    await this.sendEmail(data, metadata);
  }

  public async sendResetPassword(lang: string, user: UserAvailable, code: string): Promise<void> {
    const { email: Email, fullName: Name } = user;
    const metadata = EmailsService.buildResetPasswordMetadata(lang, code);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildResetPasswordMessage(lang, user, metadata),
    };

    await this.sendEmail(data, metadata);
  }

  public async sendResetPasswordSuccessfully(lang: string, user: UserAvailable): Promise<void> {
    const { email: Email, fullName: Name } = user;
    const metadata = EmailsService.buildPasswordResetSuccessfullyMetadata(lang);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildPasswordResetSuccessfullyMessage(lang, user, metadata),
    };

    await this.sendEmail(data, metadata);
  }

  public async sendChangePasswordSuccessfully(lang: string, user: UserAvailable): Promise<void> {
    const { email: Email, fullName: Name } = user;
    const metadata = EmailsService.buildChangePasswordSuccessfullyMetadata(lang);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildChangePasswordSuccessfullyMessage(lang, user, metadata),
    };

    await this.sendEmail(data, metadata);
  }

  public async sendForgotMyUsername(lang: string, user: UserAvailable): Promise<void> {
    const { email: Email, fullName: Name, username } = user;
    const metadata = EmailsService.buildForgotMyUsernameMetadata(lang, username);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildForgotMyUsernameMessage(lang, user, metadata),
    };

    await this.sendEmail(data, metadata);
  }

  public async sendReport(lang: string, user: UserAvailable, base64Content: string): Promise<void> {
    const { email: Email, fullName: Name } = user;
    const metadata = EmailsService.buildReportMetadata(lang);

    const data: BasicData = {
      To: [
        {
          Email,
          Name,
        },
      ],
      HTMLPart: EmailsService.buildReportMessage(lang, user, metadata),
    };

    const attachments: Attachment[] = [
      {
        ContentType: 'application/pdf',
        Filename: 'report.pdf',
        ContentID: md5(base64Content),
        Base64Content: base64Content,
      },
    ];

    await this.sendEmail(data, metadata, attachments);
  }

  private static buildLoggedInMetadata(lang: string, ip: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Detectamos un nuevo login',
        TextPart: `Si fuiste vos, ignorá este mail; si no fuiste vos cambiá tu contraseña (IP ${ip}).`,
      };
    } else {
      return {
        Subject: 'We detected a new login',
        TextPart: `If it was you, please ignore this email; if it wasn't you, change your password (IP ${ip}).`,
      };
    }
  }

  private static buildLoggedInMessage(lang: string, user: UserAvailable, ip: string, metadata: BasicMetadata): string {
    const { fullName } = user;
    const { Subject: title } = metadata;

    const message = { lang, user, title };
    let content: string;

    if (lang === 'es') {
      content =
        `\nDetectamos un nuevo login\n<br>\n` +
        `Ingresaste a tu cuenta desde la IP ${ip}.\n<br>\n` +
        `Si fuiste vos, ignorá este mail.\n<br>\n` +
        `Si no fuiste vos cambiá tu contraseña.\n<br>\n`;

      return EmailsService.buildMessage(merge(message, { content, subtitle: `Hola <b>${fullName}</b>` }));
    } else {
      content =
        `\nWe detected a new login\n<br>\n` +
        `You logged into your account from the IP ${ip}.\n<br>\n` +
        `If it was you, please ignore this email.\n<br>\n` +
        `If it wasn't you, change your password.\n<br>\n`;

      return EmailsService.buildMessage(merge(message, { content, subtitle: `Hi <b>${fullName}</b>` }));
    }
  }

  private static buildConfirmationEmailMetadata(lang: string, code: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Confirmación de correo electrónico',
        TextPart: `Su código de verificación es <b>${code}</b>.`,
      };
    } else {
      return {
        Subject: 'Confirm email',
        TextPart: `Your verification code is <b>${code}</b>.`,
      };
    }
  }

  private static buildConfirmationEmailMessage(lang: string, user: UserAvailable, metadata: BasicMetadata): string {
    const { fullName } = user;
    const { TextPart: content, Subject: title } = metadata;

    const message = { lang, user, content, title };

    if (lang === 'es') {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hola <b>${fullName}</b>` }));
    } else {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hi <b>${fullName}</b>` }));
    }
  }

  private static buildConfirmedEmailMetadata(lang: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Correo electrónico confirmado',
        TextPart: `Has validado con éxito este correo electrónico. Puedes comenzar a utilizar nuestros servicios.`,
      };
    } else {
      return {
        Subject: 'Email confirmed',
        TextPart: `You have verified this email successfully. Now, you can use own services.`,
      };
    }
  }

  private static buildConfirmedEmailMessage(lang: string, user: UserAvailable, metadata: BasicMetadata): string {
    const { fullName } = user;
    const { TextPart: content } = metadata;

    const message = { lang, user, content };

    if (lang === 'es') {
      return EmailsService.buildMessage(
        merge(message, { title: 'Felicitaciones!', subtitle: `Muy bien <b>${fullName}</b>` }),
      );
    } else {
      return EmailsService.buildMessage(
        merge(message, { title: 'Congratulations!', subtitle: `Hi again <b>${fullName}</b>` }),
      );
    }
  }

  private static buildResetPasswordMetadata(lang: string, code: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Verificación de reestablecimiento de contraseña',
        TextPart: `Su código de verificación es <b>${code}</b>.`,
      };
    } else {
      return {
        Subject: 'Reset password verification',
        TextPart: `Your verification code is <b>${code}</b>.`,
      };
    }
  }

  private static buildResetPasswordMessage(lang: string, user: UserAvailable, metadata: BasicMetadata): string {
    const { fullName } = user;
    const { TextPart: content, Subject: title } = metadata;

    const message = { lang, user, content, title };

    if (lang === 'es') {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hola <b>${fullName}</b>` }));
    } else {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hi <b>${fullName}</b>` }));
    }
  }

  private static buildPasswordResetSuccessfullyMetadata(lang: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Reestablecimiento de contraseña exitoso',
        TextPart: 'Su contraseña ha sido cambiada exitosamente.',
      };
    } else {
      return {
        Subject: 'Reset password successfully',
        TextPart: 'Your password has been changed successfully.',
      };
    }
  }

  private static buildPasswordResetSuccessfullyMessage(
    lang: string,
    user: UserAvailable,
    metadata: BasicMetadata,
  ): string {
    const { fullName } = user;
    const { TextPart: content } = metadata;

    const message = { lang, user, content };

    if (lang === 'es') {
      return EmailsService.buildMessage(
        merge(message, { title: 'Felicitaciones!', subtitle: `Muy bien <b>${fullName}</b>` }),
      );
    } else {
      return EmailsService.buildMessage(
        merge(message, { title: 'Congratulations!', subtitle: `Hi again <b>${fullName}</b>` }),
      );
    }
  }

  private static buildChangePasswordSuccessfullyMetadata(lang: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Cambio de contraseña exitoso',
        TextPart: 'Su contraseña ha sido cambiada exitosamente.',
      };
    } else {
      return {
        Subject: 'Change password successfully',
        TextPart: 'Your password has been changed successfully.',
      };
    }
  }

  private static buildChangePasswordSuccessfullyMessage(
    lang: string,
    user: UserAvailable,
    metadata: BasicMetadata,
  ): string {
    const { fullName } = user;
    const { TextPart: content } = metadata;

    const message = { lang, user, content };

    if (lang === 'es') {
      return EmailsService.buildMessage(
        merge(message, { title: 'Felicitaciones!', subtitle: `Muy bien <b>${fullName}</b>` }),
      );
    } else {
      return EmailsService.buildMessage(
        merge(message, { title: 'Congratulations!', subtitle: `Hi again <b>${fullName}</b>` }),
      );
    }
  }

  private static buildForgotMyUsernameMetadata(lang: string, username: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Olvidé mi nombre de usuario',
        TextPart: `Su nombre de usuario es <b>${username}</b>`,
      };
    } else {
      return {
        Subject: 'I forgot my username',
        TextPart: `Your username is <b>${username}</b>`,
      };
    }
  }

  private static buildForgotMyUsernameMessage(lang: string, user: UserAvailable, metadata: BasicMetadata): string {
    const { fullName } = user;
    const { TextPart: content, Subject: title } = metadata;

    const message = { lang, user, content, title };

    if (lang === 'es') {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hola <b>${fullName}</b>` }));
    } else {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hi <b>${fullName}</b>` }));
    }
  }

  private static buildReportMetadata(lang: string): BasicMetadata {
    if (lang === 'es') {
      return {
        Subject: 'Reporte generado',
        TextPart: `Felicitaciones! Adjunto a este correo se encuentra su reporte.`,
      };
    } else {
      return {
        Subject: 'Report',
        TextPart: `Congratulations! Attached to this email is your report.`,
      };
    }
  }

  private static buildReportMessage(lang: string, user: UserAvailable, metadata: BasicMetadata): string {
    const { fullName } = user;
    const { TextPart: content, Subject: title } = metadata;

    const message = { lang, user, content, title };

    if (lang === 'es') {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hola <b>${fullName}</b>` }));
    } else {
      return EmailsService.buildMessage(merge(message, { subtitle: `Hi <b>${fullName}</b>` }));
    }
  }

  private static buildMessage(message: Message): string {
    const { lang, title, subtitle, content, user } = message;
    return (
      `<h3 style="color:#051d39">${title}</h3>\n<h5>${subtitle},</h5>\n<p>${content}</p>\n` +
      EmailsService.buildSignature(lang, user)
    );
  }

  private static buildSignature(lang: string, user: UserAvailable): string {
    const { username } = user;

    if (lang === 'es') {
      return (
        // eslint-disable-next-line max-len
        `<p><i>Ojo, por nada del mundo se olvide el nombre de usuario que es '<b>${username}</b>'. La contraseña nos la olvidamos con frecuencia :(</i></p>\n` +
        '<p>Muchas gracias y que tenga un estupendo día,</p>\n' +
        `<p>El equipo de <a href="https://company.x" target="_blank" class="il">${ISSUER}</a></p>\n`
      );
    } else {
      return (
        // eslint-disable-next-line max-len
        `<p><i>Be careful, for nothing in the world do you forget the username that is '<b>${username}</b>'. We often forget the password :(</i></p>\n` +
        '<p>Thank you very much and have a great day,</p>\n' +
        `<p>The <a href="https://company.x" target="_blank" class="il">${ISSUER}</a> team</p>\n`
      );
    }
  }

  private async sendEmail(data: BasicData, metadata: BasicMetadata, attachments: Attachment[] = []): Promise<any> {
    const { To, HTMLPart } = data;
    const { Subject, TextPart } = metadata;

    return this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: this.fromEmail,
            Name: this.fromName,
          },
          InlinedAttachments: attachments,
          To,
          Subject: PREFIX + Subject,
          TextPart,
          HTMLPart,
        },
      ],
    });
  }
}
