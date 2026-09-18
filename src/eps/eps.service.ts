import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Eps } from './entities/eps.entity';

@Injectable()
export class EpsService {
  constructor(
    @InjectRepository(Eps)
    private readonly epsRepository: Repository<Eps>,
  ) {}

  findAll(): Promise<Eps[]> {
    return this.epsRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Eps> {
    const eps = await this.epsRepository.findOne({ where: { id } });
    if (!eps) {
      throw new NotFoundException(`No se encontro la EPS con id ${id}`);
    }
    return eps;
  }
}
