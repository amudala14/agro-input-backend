import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { CreateFarmerDto } from './dto/createFarmer.dto';
import { UpdateFarmerDto } from './dto/updateFarmer.dto';
import { Farmer } from './schemas/farmer.schema';

@Controller('farmers')
export class FarmersController {
  constructor(private farmersService: FarmersService) {}

  @Post()
  create(@Body() createFarmerDto: CreateFarmerDto) {
    return this.farmersService.create(createFarmerDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ): Promise<Farmer[]> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    return this.farmersService.findAll(safePage, safeLimit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFarmerDto: UpdateFarmerDto) {
    return this.farmersService.update(id, updateFarmerDto);
  }
}
