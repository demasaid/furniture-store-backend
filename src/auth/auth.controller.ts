import {
  Body,
  Controller,
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
  signup(@Body() Data: SignupDto) {
    return this.authService.signup(Data);
  }

  @Post('signin')
  signin(@Body() Data: SigninDto) {
    return this.authService.signin(Data);
  }

  @Post('tfa')
  verifyTfa(@Body() Data: VerifyTfaDto) {
    return this.authService.verifyTfa(Data);
  }


}
