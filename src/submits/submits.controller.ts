import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubmitsService } from './submits.service';
import { CreateSubmitDto } from './dto/create-submit.dto';
import { UpdateSubmitDto } from './dto/update-submit.dto';

@Controller('submits')
export class SubmitsController {
  constructor(private readonly submitsService: SubmitsService) {}

  @Post()
  create(@Body() createSubmitDto: CreateSubmitDto) {
    return this.submitsService.create(createSubmitDto);
  }

  @Get()
  findAll() {
    return this.submitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubmitDto: UpdateSubmitDto) {
    return this.submitsService.update(+id, updateSubmitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submitsService.remove(+id);
  }
}
