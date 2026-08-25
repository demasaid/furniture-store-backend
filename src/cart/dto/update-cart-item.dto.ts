import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  userId!: number;

  @IsInt()
  furnitureId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
