import { Injectable } from '@nestjs/common';
import { EmailsService } from '../notifications';
import {
  ChangePasswordDTO,
  ChangeUserDataDTO,
  LoginDTO,
  RegisterUserDTO,
  RequestResetPasswordDTO,
  RequestUsernameDTO,
  ResetPasswordDTO,
  UserAvailable,
  UsersService,
  VerifyUserDTO,
} from './user';
import { JwtAuthService, JwtPayload } from './jwt-auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  public async signUp(lang: string, dto: RegisterUserDTO): Promise<UserAvailable> {
    const { user, code } = await this.usersService.create(lang, dto);
    await this.emailsService.sendConfirmationEmail(lang, user, code);
    return user;
  }

  public async login(lang: string, dto: LoginDTO, ip: string): Promise<{ accessToken: string }> {
    const user: UserAvailable = await this.usersService.findWithCredentials(lang, dto);
    await this.emailsService.sendLoggedIn(lang, user, ip);
    const payload: JwtPayload = this.jwtAuthService.generatePayloadFromUser(user);
    return this.jwtAuthService.generateJwt(payload);
  }

  public async verifyUser(lang: string, dto: VerifyUserDTO): Promise<UserAvailable> {
    const user: UserAvailable = await this.usersService.verify(lang, dto);
    await this.emailsService.sendConfirmedEmail(lang, user);
    return user;
  }

  public async requestResetPassword(lang: string, dto: RequestResetPasswordDTO): Promise<void> {
    const { user, code } = await this.usersService.requestResetPassword(lang, dto);
    await this.emailsService.sendResetPassword(lang, user, code);
  }

  public async resetPassword(lang: string, dto: ResetPasswordDTO): Promise<UserAvailable> {
    const user: UserAvailable = await this.usersService.resetPassword(lang, dto);
    await this.emailsService.sendResetPasswordSuccessfully(lang, user);
    return user;
  }

  public async changePassword(lang: string, dto: ChangePasswordDTO): Promise<UserAvailable> {
    const user: UserAvailable = await this.usersService.changePassword(lang, dto);
    await this.emailsService.sendChangePasswordSuccessfully(lang, user);
    return user;
  }

  public async changeUserData(lang: string, dto: ChangeUserDataDTO): Promise<UserAvailable> {
    const { user, code } = await this.usersService.changeUserData(lang, dto);

    if (code) {
      await this.emailsService.sendConfirmationEmail(lang, user, code);
    }

    return user;
  }

  public async forgotMyUsername(lang: string, dto: RequestUsernameDTO): Promise<void> {
    const user: UserAvailable = await this.usersService.findUserByEmail(lang, dto);
    await this.emailsService.sendForgotMyUsername(lang, user);
  }
}
