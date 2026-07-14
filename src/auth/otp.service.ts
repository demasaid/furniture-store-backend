import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcrypt';

interface OtpRecord {
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

@Injectable()
export class OtpService {
  // Temporary storage for development.
  // The OTP disappears when the server restarts.
  private readonly otpStore = new Map<number, OtpRecord>();

  async createOtp(userId: number): Promise<string> {
    // Generate a random 6-digit code.
    const code = randomInt(100000, 1000000).toString();

    // Store the hash, not the original OTP.
    const codeHash = await bcrypt.hash(code, 10);

    this.otpStore.set(userId, {
      codeHash,

      // The OTP is valid for 5 minutes.
      expiresAt: Date.now() + 5 * 60 * 1000,

      attempts: 0,
    });

    return code;
  }

  sendOtp(phone: string, code: string): void {
    // Development version:
    // later we will replace this with a real SMS provider.
    console.log('--------------------------------');
    console.log(`[DEV SMS] Phone: ${phone}`);
    console.log(`[DEV SMS] OTP code: ${code}`);
    console.log('--------------------------------');
  }

  async verifyOtp(
    userId: number,
    code: string,
  ): Promise<boolean> {
    const otpRecord = this.otpStore.get(userId);

    if (!otpRecord) {
      throw new UnauthorizedException(
        'OTP was not found or has expired',
      );
    }

    if (Date.now() > otpRecord.expiresAt) {
      this.otpStore.delete(userId);

      throw new UnauthorizedException('OTP has expired');
    }

    if (otpRecord.attempts >= 5) {
      this.otpStore.delete(userId);

      throw new UnauthorizedException(
        'Too many invalid OTP attempts',
      );
    }

    const isValid = await bcrypt.compare(
      code,
      otpRecord.codeHash,
    );

    if (!isValid) {
      otpRecord.attempts += 1;
      this.otpStore.set(userId, otpRecord);

      return false;
    }

    // A valid OTP can only be used once.
    this.otpStore.delete(userId);

    return true;
  }
}