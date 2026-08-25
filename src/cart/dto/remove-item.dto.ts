import { IsInt } from 'class-validator';

export class RemoveItemDto {
  @IsInt()
  userId!: number;

  @IsInt()
  furnitureId!: number;
}
