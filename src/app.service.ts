import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <h1> Dema </h1>
    <h3> Saed </h3>
    `;
  }
}
