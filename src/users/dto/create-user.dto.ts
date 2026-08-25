import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

// Same shape as SignupDto (see src/auth/dto/signup.dto.ts) because
// creating a user through POST /users must go through the exact same
// rules as /auth/signup — otherwise someone could create an account
// with a weak/missing password or a raw (unhashed) password field.
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Phone number must include a valid country code',
  })
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isTFAEnabled?: boolean;

  @IsOptional()
  @IsString()
  address?: string;
}
