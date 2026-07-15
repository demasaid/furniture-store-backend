import { Injectable } from '@nestjs/common';
import { usersData } from './data';

@Injectable()
export class AppService {
  constructor() {}

  findUserById(id: string) {
    return  usersData.find((item) => item.id === id);
  }
  
}