import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactoEmergencia } from './entities/contacto-emergencia.entity';
import { CreateContactoEmergenciaDto } from './dto/create-contacto-emergencia.dto';
import { UpdateContactoEmergenciaDto } from './dto/update-contacto-emergencia.dto';
import { PersonasService } from '../personas/personas.service';

@Injectable()
export class ContactosEmergenciaService {
  constructor(
    @InjectRepository(ContactoEmergencia)
    private readonly contactoRepository: Repository<ContactoEmergencia>,
    private readonly personasService: PersonasService,
  ) {}

  async create(
    personaId: string,
    dto: CreateContactoEmergenciaDto,
  ): Promise<ContactoEmergencia> {
    // Lanza NotFoundException si la persona no existe.
    await this.personasService.findOne(personaId);

    const contacto = this.contactoRepository.create({ ...dto, personaId });
    return this.contactoRepository.save(contacto);
  }

  async findAllByPersona(personaId: string): Promise<ContactoEmergencia[]> {
    await this.personasService.findOne(personaId);

    return this.contactoRepository.find({
      where: { personaId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ContactoEmergencia> {
    const contacto = await this.contactoRepository.findOne({ where: { id } });
    if (!contacto) {
      throw new NotFoundException(`No se encontro el contacto de emergencia con id ${id}`);
    }
    return contacto;
  }

  async update(id: string, dto: UpdateContactoEmergenciaDto): Promise<ContactoEmergencia> {
    const contacto = await this.findOne(id);
    Object.assign(contacto, dto);
    return this.contactoRepository.save(contacto);
  }

  async remove(id: string): Promise<void> {
    const contacto = await this.findOne(id);
    await this.contactoRepository.remove(contacto);
  }
}
