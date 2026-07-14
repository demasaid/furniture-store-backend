import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/user.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyTfaDto } from './dto/verify-tfa.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  // POST /auth/signup
  async signup(signupDto: SignupDto) {
    const email = signupDto.email.trim().toLowerCase();
    const phone = signupDto.phone?.trim();

    // Check whether the email is already registered.
    const existingUser =
      await this.usersService.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'Email is already registered',
      );
    }

    // A user cannot enable SMS TFA without a phone number.
    if (signupDto.isTFAEnabled && !phone) {
      throw new BadRequestException(
        'Phone number is required when TFA is enabled',
      );
    }

    // Check whether another account uses this phone.
    if (phone) {
      const existingPhone =
        await this.usersService.findUserByPhone(phone);

      if (existingPhone) {
        throw new ConflictException(
          'Phone number is already registered',
        );
      }
    }

    // Convert the original password into a secure hash.
    const passwordHash = await bcrypt.hash(
      signupDto.password,
      10,
    );

    const user = await this.usersService.createUser({
      firstName: signupDto.firstName.trim(),
      lastName: signupDto.lastName.trim(),
      email,
      phone: phone ?? null,
      passwordHash,
      isTFAEnabled: signupDto.isTFAEnabled ?? false,
      address: signupDto.address?.trim() || null,
    });

    // Remove passwordHash before returning the user.
    const {
      passwordHash: hiddenPasswordHash,
      ...safeUser
    } = user;

    return {
      message: 'User registered successfully',
      user: safeUser,
    };
  }

  // POST /auth/signin
  async signin(signinDto: SigninDto) {
    const email = signinDto.email.trim().toLowerCase();

    const user =
      await this.usersService.findUserByEmail(email);

    // Use one general message so we do not reveal
    // whether the email exists.
    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      signinDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // If TFA is disabled, login is complete.
    if (!user.isTFAEnabled) {
      const accessToken =
        await this.createAccessToken(user);

      return {
        requiresTFA: false,
        accessToken,
      };
    }

    // If TFA is enabled, a phone must exist.
    if (!user.phone) {
      throw new BadRequestException(
        'TFA is enabled but no phone number is registered',
      );
    }

    // Create and send an OTP after the password is correct.
    const otpCode = await this.otpService.createOtp(
      user.id,
    );

    this.otpService.sendOtp(user.phone, otpCode);

    return {
      requiresTFA: true,
      userId: user.id,
      message: 'OTP was sent to your phone',
    };
  }

  // POST /auth/tfa
  async verifyTfa(verifyTfaDto: VerifyTfaDto) {
    const user =
      await this.usersService.findAuthUserById(
        verifyTfaDto.userId,
      );

    if (!user || !user.isTFAEnabled) {
      throw new UnauthorizedException(
        'TFA verification is not available for this user',
      );
    }

    const isOtpValid = await this.otpService.verifyOtp(
      user.id,
      verifyTfaDto.code,
    );

    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Login is complete only after the OTP is correct.
    const accessToken =
      await this.createAccessToken(user);

    return {
      message: 'Login successful',
      accessToken,
    };
  }

  private createAccessToken(user: {
    id: number;
    email: string;
  }): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }
}