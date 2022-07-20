import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generate, GenerateOptions } from 'generate-password';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Profile } from 'passport';
import {
  VerifyUserDTO,
  LoginDTO,
  RegisterUserDTO,
  RequestResetPasswordDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
  ChangeUserDataDTO,
  UpdatePaymentDataDTO,
  RequestUsernameDTO,
} from './dtos';
import { InvalidActivationCode, InvalidCredentials, InvalidResetPasswordCode, UserExistsError } from '../../../errors';
import { User, UserAvailable, UserEntity } from './user.entity';
import { generateToken, isValidPassword, sanitizeUser } from './users.functions';
import { JwtPayload } from '../jwt-auth';
import { UNKNOWN, LOCAL_PROVIDER } from './users.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly i18n: I18nService,
  ) {}

  public async findOrCreate(lang: string, profile: Profile): Promise<{ user: UserAvailable; code: string | null }> {
    const { provider, id: username, displayName: fullName, emails } = profile;

    const found: User | null = await this.repository.findOneBy({ provider, username });

    if (found) {
      if (found.isActive === false) {
        throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
      }

      return { user: sanitizeUser(found), code: null };
    }

    const email: string = emails?.length > 0 ? emails[0].value : UNKNOWN;
    const password: string = UsersService.generatePassword();

    const saved: UserEntity = await this.createEntityAndSave({ provider, username, password, fullName, email });
    return { user: sanitizeUser(saved), code: saved.activationCode };
  }

  public async create(lang: string, dto: RegisterUserDTO): Promise<{ user: UserAvailable; code: string }> {
    const { username, password, fullName, email } = dto;
    const provider: string = LOCAL_PROVIDER;
    const found: User | null = await this.repository.findOneBy({ provider, username });

    if (found) {
      throw new UserExistsError(this.i18n.t('test.USER_EXISTS', { lang }));
    }

    const saved: UserEntity = await this.createEntityAndSave({ provider, username, password, fullName, email });
    return { user: sanitizeUser(saved), code: saved.activationCode };
  }

  public async verify(lang: string, dto: VerifyUserDTO): Promise<UserAvailable> {
    const { username, code } = dto;
    const found: UserEntity | null = await this.find(username, false);

    if (found && found.activationCode === code) {
      found.isVerified = true;
      found.activationCode = null;
      const saved: UserEntity = await this.repository.save(found);
      return sanitizeUser(saved);
    }

    throw new InvalidActivationCode(this.i18n.t('test.INVALID_ACTIVATION_CODE', { lang }));
  }

  public async findWithCredentials(lang: string, dto: LoginDTO): Promise<UserAvailable> {
    const { username, password } = dto;

    const found: User | null = await this.findAndComparePassword(username, password);

    if (!found) {
      throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
    }

    return sanitizeUser(found);
  }

  public async findUserByEmail(lang: string, dto: RequestUsernameDTO): Promise<UserAvailable> {
    const { email } = dto;
    const found: User | null = await this.repository.findOneBy({ email });

    if (!found) {
      throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
    }

    return sanitizeUser(found);
  }

  public async findWithPayload(lang: string, payload: JwtPayload): Promise<UserAvailable> {
    const { provider, sub, username } = payload;

    let found: User | null;

    if (provider === LOCAL_PROVIDER) {
      found = await this.repository.findOneBy({
        provider,
        username,
        isActive: true,
        isVerified: true,
      });
    } else {
      found = await this.repository.findOneBy({
        provider,
        username: sub,
        isActive: true,
      });
    }

    if (!found) {
      throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
    }

    return sanitizeUser(found);
  }

  public async requestResetPassword(
    lang: string,
    dto: RequestResetPasswordDTO,
  ): Promise<{ user: UserAvailable; code: string }> {
    const found: UserEntity | null = await this.find(dto.username);

    if (!found) {
      throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
    }

    found.resetPasswordCode = generateToken();
    const saved: UserEntity = await this.repository.save(found);
    return { user: sanitizeUser(saved), code: saved.resetPasswordCode };
  }

  public async resetPassword(lang: string, dto: ResetPasswordDTO): Promise<UserAvailable> {
    const { username, code, password } = dto;
    const found: UserEntity | null = await this.find(username);

    if (found && found.resetPasswordCode === code) {
      found.resetPasswordCode = null;
      found.password = password;
      const saved: UserEntity = await this.repository.save(found);
      return sanitizeUser(saved);
    }

    throw new InvalidResetPasswordCode(this.i18n.t('test.INVALID_RESET_PASSWORD_CODE', { lang }));
  }

  public async changePassword(lang: string, dto: ChangePasswordDTO): Promise<UserAvailable> {
    const { username, oldPassword, newPassword } = dto;
    const found: UserEntity | null = await this.findAndComparePassword(username, oldPassword);

    if (!found) {
      throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
    }

    if (oldPassword === newPassword) {
      return sanitizeUser(found);
    }

    found.password = newPassword;
    const saved: UserEntity = await this.repository.save(found);
    return sanitizeUser(saved);
  }

  public async changeUserData(lang: string, dto: ChangeUserDataDTO): Promise<{ user: UserAvailable; code: string }> {
    const { username, fullName, email } = dto;
    const found: UserEntity | null = await this.find(username);

    if (!found) {
      throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
    }

    const emailChanged: boolean = found.email !== email;
    found.fullName = fullName;
    found.email = email;

    if (emailChanged) {
      found.activationCode = generateToken();
      found.isVerified = false;
    }

    const saved: UserEntity = await this.repository.save(found);
    return { user: sanitizeUser(saved), code: found.activationCode };
  }

  public async updatePaymentData(lang: string, dto: UpdatePaymentDataDTO): Promise<UserAvailable> {
    const { username, paymentsCustomerId } = dto;
    const found: UserEntity | null = await this.find(username);

    if (!found) {
      throw new InvalidCredentials(this.i18n.t('test.INVALID_CREDENTIALS', { lang }));
    }

    found.paymentsCustomerId = paymentsCustomerId;
    found.paymentsProvider = 'X';

    const saved: UserEntity = await this.repository.save(found);
    return sanitizeUser(saved);
  }

  private createEntityAndSave({ provider, username, password, fullName, email }: any): Promise<UserEntity> {
    const entity: UserEntity = new UserEntity();

    entity.provider = provider;
    entity.username = username;
    entity.password = password;
    entity.fullName = fullName;
    entity.email = email;

    return this.repository.save(entity);
  }

  private async find(username: string, isVerified = true, isActive = true): Promise<UserEntity | null> {
    return await this.repository.findOneBy({
      username,
      isActive,
      isVerified,
    });
  }

  private async findAndComparePassword(username: string, password: string): Promise<UserEntity | null> {
    const found: UserEntity | null = await this.find(username);
    return found && (await isValidPassword(found, password)) ? found : null;
  }

  private static generatePassword(): string {
    const options: GenerateOptions = {
      length: 36,
      symbols: true,
      numbers: true,
      excludeSimilarCharacters: true,
      uppercase: true,
      lowercase: true,
    };

    return generate(options);
  }
}
