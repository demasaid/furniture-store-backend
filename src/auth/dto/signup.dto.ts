import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignupDto {
  // First name must be a non-empty string
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  // Last name must be a non-empty string
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  // Must be written in a valid email format
  @IsEmail()
  email!: string;

  // Password must be a string with at least 8 characters
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  // Phone is required when TFA is enabled.
  // Example: +972501234567
  @ValidateIf(
    (data: SignupDto) =>
      data.isTFAEnabled === true || data.phone !== undefined,
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Phone number must include a valid country code',
  })
  phone?: string;

  // TFA is optional during signup
  @IsOptional()
  @IsBoolean()
  isTFAEnabled?: boolean;

  // Address is optional
  @IsOptional()
  @IsString()
  address?: string;
}