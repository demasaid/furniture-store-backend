import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return `
      <h1>Dema</h1>
      <h3>Furniture Store API</h3>
    `;
  }
}