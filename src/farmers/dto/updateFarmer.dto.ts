import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmerDto } from './createFarmer.dto';

export class UpdateFarmerDto extends PartialType(CreateFarmerDto) {}
