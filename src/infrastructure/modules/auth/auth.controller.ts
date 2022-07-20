import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Res, UseGuards } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { I18nLang } from 'nestjs-i18n';
import { Response } from 'express';
import { EmailsService } from '../notifications';
import { BasicOpenApiTags } from '../../config';
import { HttpExceptionSwagger } from '../../helpers';
import { convertToHttpException } from '../../errors';
import {
  AuthUser,
  BasicUserDTO,
  ChangePasswordDTO,
  ChangeUserDataDTO,
  LoginDTO,
  RegisterUserDTO,
  RequestResetPasswordDTO,
  RequestUsernameDTO,
  ResetPasswordDTO,
  UserAvailable,
  VerifyUserDTO,
} from './user';
import { JWT_COOKIE_NAME, JwtAuthGuard, JwtAuthService, JwtPayload, JwtTokensDTO } from './jwt-auth';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags(BasicOpenApiTags.LocalAuth)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly authService: AuthService,
    private readonly emailsService: EmailsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Basic user data',
    type: BasicUserDTO,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async signUp(@I18nLang() lang: string, @Body() body: RegisterUserDTO): Promise<BasicUserDTO> {
    try {
      const created: UserAvailable = await this.authService.signUp(lang, body);
      return new BasicUserDTO(created);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiBody({
    type: LoginDTO,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Basic users data',
    type: JwtTokensDTO,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async login(
    @I18nLang() lang: string,
    @RealIP() ip: string,
    @AuthUser() user,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtTokensDTO> {
    await this.emailsService.sendLoggedIn(lang, user, ip);
    const payload: JwtPayload = this.jwtAuthService.generatePayloadFromUser(user);
    const { accessToken } = this.jwtAuthService.generateJwt(payload);
    res.cookie(JWT_COOKIE_NAME, accessToken);
    return new JwtTokensDTO({ access_token: accessToken });
  }

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The verified user',
    type: BasicUserDTO,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async verifyUser(@I18nLang() lang: string, @Body() body: VerifyUserDTO) {
    try {
      const verified: UserAvailable = await this.authService.verifyUser(lang, body);
      return new BasicUserDTO(verified);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get users data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Basic users data',
    type: BasicUserDTO,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized response',
    type: () => HttpExceptionSwagger,
  })
  public getBasicData(@AuthUser() user): BasicUserDTO {
    return new BasicUserDTO(user);
  }

  @Post('/request-reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request reset password' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The response does not return content',
    type: undefined,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async requestResetPassword(@I18nLang() lang: string, @Body() body: RequestResetPasswordDTO): Promise<void> {
    try {
      await this.authService.requestResetPassword(lang, body);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Basic user data',
    type: BasicUserDTO,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async resetPassword(@I18nLang() lang: string, @Body() body: ResetPasswordDTO): Promise<UserAvailable> {
    try {
      const userData: UserAvailable = await this.authService.resetPassword(lang, body);
      return new BasicUserDTO(userData);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Basic user data',
    type: BasicUserDTO,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized response',
    type: () => HttpExceptionSwagger,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async changePassword(@I18nLang() lang: string, @Body() body: ChangePasswordDTO): Promise<UserAvailable> {
    try {
      const userData: UserAvailable = await this.authService.changePassword(lang, body);
      return new BasicUserDTO(userData);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Basic user data',
    type: BasicUserDTO,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized response',
    type: () => HttpExceptionSwagger,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async changeUserData(@I18nLang() lang: string, @Body() body: ChangeUserDataDTO): Promise<UserAvailable> {
    try {
      const userData: UserAvailable = await this.authService.changeUserData(lang, body);
      return new BasicUserDTO(userData);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }

  @Post('/forgot-my-username')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request username' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The response does not return content',
    type: undefined,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request response',
    type: () => HttpExceptionSwagger,
  })
  public async forgotMyUsername(@I18nLang() lang: string, @Body() body: RequestUsernameDTO): Promise<void> {
    try {
      await this.authService.forgotMyUsername(lang, body);
    } catch (e) {
      throw convertToHttpException(e);
    }
  }
}
