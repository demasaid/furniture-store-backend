import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class VerifyTfaDto {
  @IsInt()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'OTP must contain exactly 6 digits',
  })
  code!: string;
}