import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';
import { ContactoEmergencia } from '../contactos-emergencia/entities/contacto-emergencia.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { FindPersonasQueryDto } from './dto/find-personas-query.dto';

const SQL_SERVER_UNIQUE_VIOLATION_CODES = [2627, 2601];

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(ContactoEmergencia)
    private readonly contactoRepository: Repository<ContactoEmergencia>,
  ) {}

  async create(dto: CreatePersonaDto): Promise<Persona> {
    const persona = this.personaRepository.create(dto);
    return this.save(persona);
  }

  async findAll(query: FindPersonasQueryDto): Promise<{ data: Persona[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [data, total] = await this.personaRepository.findAndCount({
      where: {
        ...(query.correo && { correo: query.correo }),
        ...(query.soloActivas !== false && { activo: true }),
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Persona> {
    const persona = await this.personaRepository.findOne({ where: { id } });
    if (!persona) {
      throw new NotFoundException(`No se encontro la persona con id ${id}`);
    }
    return persona;
  }

  async update(id: string, dto: UpdatePersonaDto): Promise<Persona> {
    const persona = await this.findOne(id);
    Object.assign(persona, dto);
    return this.save(persona);
  }

  async deactivate(id: string): Promise<Persona> {
    const persona = await this.findOne(id);
    persona.activo = false;
    return this.personaRepository.save(persona);
  }

  async getInfoParaRobo(id: string): Promise<{
    id: string;
    tipoSangre: string | null;
    factorRh: string | null;
    eps: string | null;
    contactosEmergencia: { nombre: string; telefono: string; parentesco: string }[];
  }> {
    const persona = await this.findOne(id);
    const contactos = await this.contactoRepository.find({ where: { personaId: id } });

    return {
      id: persona.id,
      tipoSangre: persona.tipoSangre,
      factorRh: persona.factorRh,
      eps: persona.eps,
      contactosEmergencia: contactos.map((c) => ({
        nombre: c.nombre,
        telefono: c.telefono,
        parentesco: c.parentesco,
      })),
    };
  }

  private async save(persona: Persona): Promise<Persona> {
    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      const errorNumber =
        error instanceof QueryFailedError
          ? (error.driverError as { number?: number })?.number
          : undefined;

      if (errorNumber !== undefined && SQL_SERVER_UNIQUE_VIOLATION_CODES.includes(errorNumber)) {
        throw new ConflictException(
          'Ya existe una persona registrada con ese correo',
        );
      }
      throw error;
    }
  }
}
