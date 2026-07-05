import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { FurnitureService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly furnitureService: FurnitureService) {}

  @Get()
  getHello() {
    return `
      <h1>Dema</h1>
      <h3>Furniture Store API</h3>
    `;
  }


@Get('random')
getrandomnumber() {
  return Math.floor(Math.random() * 100) + 1;
}

 @Get('number/:num')
  getNumber(@Param('num') num: string) {
    return  Number(num) *Number(num) ;

  }

  @Get('id/:id')
  getDataById(@Param('id') id: string) {
    return this.furnitureService.findUserById(id);
  }
}