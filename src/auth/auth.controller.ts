import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyTfaDto } from './dto/verify-tfa.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('tfa')
  @HttpCode(HttpStatus.OK)
  verifyTfa(@Body() verifyTfaDto: VerifyTfaDto) {
    return this.authService.verifyTfa(verifyTfaDto);
  }
}