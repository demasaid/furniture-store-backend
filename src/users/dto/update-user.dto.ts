import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

// Password and email are intentionally not editable here.
// Changing an email or a password is sensitive enough that it
// deserves its own dedicated, re-authenticated endpoint later --
// not a generic PATCH.
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
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
