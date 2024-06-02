import { IsNotEmpty, IsNumber, Length, Matches } from 'class-validator';

export class CreateFarmerDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 30, { message: 'Name must be between 3 and 30 characters long' })
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @IsNumber({}, { message: 'Land size must be a valid number' })
  @IsNotEmpty({ message: 'Land size is required' })
  landSize: number;
}
