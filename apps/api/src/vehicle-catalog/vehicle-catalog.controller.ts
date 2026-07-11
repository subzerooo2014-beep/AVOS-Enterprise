import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { VehicleCatalogService } from './vehicle-catalog.service';
import { CatalogQueryDto } from './catalog-query.dto';
import { CreateCatalogItemDto } from './create-catalog-item.dto';
import { UpdateCatalogItemDto } from './update-catalog-item.dto';

@Controller('vehicle-catalog')
export class VehicleCatalogController {
  constructor(private readonly service: VehicleCatalogService) {}

  @Get('summary')
  summary() {
    return this.service.catalogSummary();
  }

  @Get('brands')
  brands(@Query() query: CatalogQueryDto) {
    return this.service.brands(query);
  }

  @Post('brands')
  createBrand(@Body() dto: CreateCatalogItemDto) {
    return this.service.createBrand(dto);
  }

  @Get('brands/:id')
  brand(@Param('id') id: string) {
    return this.service.brand(id);
  }

  @Patch('brands/:id')
  updateBrand(@Param('id') id: string, @Body() dto: UpdateCatalogItemDto) {
    return this.service.updateBrand(id, dto);
  }

  @Delete('brands/:id')
  deleteBrand(@Param('id') id: string) {
    return this.service.deleteBrand(id);
  }

  @Get('models')
  models(@Query() query: CatalogQueryDto) {
    return this.service.models(query);
  }

  @Post('models')
  createModel(@Body() dto: CreateCatalogItemDto) {
    return this.service.createModel(dto);
  }

  @Get('models/:id')
  model(@Param('id') id: string) {
    return this.service.model(id);
  }

  @Patch('models/:id')
  updateModel(@Param('id') id: string, @Body() dto: UpdateCatalogItemDto) {
    return this.service.updateModel(id, dto);
  }

  @Delete('models/:id')
  deleteModel(@Param('id') id: string) {
    return this.service.deleteModel(id);
  }

  @Get('trims')
  trims(@Query() query: CatalogQueryDto) {
    return this.service.trims(query);
  }

  @Post('trims')
  createTrim(@Body() dto: CreateCatalogItemDto) {
    return this.service.createTrim(dto);
  }

  @Get('trims/:id')
  trim(@Param('id') id: string) {
    return this.service.trim(id);
  }

  @Patch('trims/:id')
  updateTrim(@Param('id') id: string, @Body() dto: UpdateCatalogItemDto) {
    return this.service.updateTrim(id, dto);
  }

  @Delete('trims/:id')
  deleteTrim(@Param('id') id: string) {
    return this.service.deleteTrim(id);
  }
}
