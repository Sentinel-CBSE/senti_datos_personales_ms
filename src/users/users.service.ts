import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../personas/entities/persona.entity';
import { ContactoEmergencia } from '../contactos-emergencia/entities/contacto-emergencia.entity';
import { FactorRh } from '../common/enums/factor-rh.enum';
import { TipoSangre } from '../common/enums/tipo-sangre.enum';
import { UserUpdateBodyDto } from './dto/user-update-body.dto';
import { EmergencyContactRequestDto } from './dto/emergency-contact-request.dto';
import { EmergencyContactResponseDto, UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(ContactoEmergencia)
    private readonly contactoRepository: Repository<ContactoEmergencia>,
  ) {}

  extractFirebaseInfo(uid: string | undefined): { uid: string } {
    if (!uid) throw new UnauthorizedException('Header X-Firebase-User-Id requerido');
    return { uid };
  }

  async getProfile(uid: string): Promise<UserResponseDto> {
    let persona = await this.personaRepository.findOne({ where: { id: uid } });

    if (!persona) {
      persona = this.personaRepository.create({ id: uid, tipoSangre: null, factorRh: null, eps: null });
      await this.personaRepository.save(persona);
    }

    const contacts = await this.contactoRepository.find({ where: { personaId: uid } });
    return this.toUserResponse(persona, contacts);
  }

  async upsertProfile(uid: string, dto: UserUpdateBodyDto): Promise<UserResponseDto> {
    const persona = await this.personaRepository.findOne({ where: { id: uid } });
    if (!persona) throw new NotFoundException(`Usuario ${uid} no encontrado`);

    if (dto.bloodTypeLetter !== undefined) persona.tipoSangre = dto.bloodTypeLetter as unknown as TipoSangre;
    if (dto.bloodTypeRh !== undefined) persona.factorRh = this.mapRhToDb(dto.bloodTypeRh);
    if (dto.eps !== undefined) persona.eps = dto.eps;

    await this.personaRepository.save(persona);
    const contacts = await this.contactoRepository.find({ where: { personaId: uid } });
    return this.toUserResponse(persona, contacts);
  }

  async addEmergencyContact(uid: string, dto: EmergencyContactRequestDto): Promise<UserResponseDto> {
    let persona = await this.personaRepository.findOne({ where: { id: uid } });

    if (!persona) {
      persona = this.personaRepository.create({ id: uid, tipoSangre: null, factorRh: null, eps: null });
      await this.personaRepository.save(persona);
    }

    const contacto = this.contactoRepository.create({
      personaId: uid,
      nombre: dto.name,
      telefono: dto.phoneNumber,
      parentesco: dto.relationship,
    });
    await this.contactoRepository.save(contacto);

    const contacts = await this.contactoRepository.find({ where: { personaId: uid } });
    return this.toUserResponse(persona, contacts);
  }

  async updateEmergencyContact(uid: string, contactId: string, dto: EmergencyContactRequestDto): Promise<UserResponseDto> {
    const contacto = await this.contactoRepository.findOne({ where: { id: contactId } });
    if (!contacto) throw new NotFoundException(`Contacto ${contactId} no encontrado`);
    if (contacto.personaId !== uid) throw new ForbiddenException('No tienes permiso para modificar este contacto');

    contacto.nombre = dto.name;
    contacto.telefono = dto.phoneNumber;
    contacto.parentesco = dto.relationship;
    await this.contactoRepository.save(contacto);

    const persona = await this.personaRepository.findOne({ where: { id: contacto.personaId } });
    if (!persona) throw new NotFoundException('Persona no encontrada');

    const contacts = await this.contactoRepository.find({ where: { personaId: persona.id } });
    return this.toUserResponse(persona, contacts);
  }

  async deleteEmergencyContact(uid: string, contactId: string): Promise<UserResponseDto> {
    const contacto = await this.contactoRepository.findOne({ where: { id: contactId } });
    if (!contacto) throw new NotFoundException(`Contacto ${contactId} no encontrado`);
    if (contacto.personaId !== uid) throw new ForbiddenException('No tienes permiso para eliminar este contacto');

    const personaId = contacto.personaId;
    await this.contactoRepository.remove(contacto);

    const persona = await this.personaRepository.findOne({ where: { id: personaId } });
    if (!persona) throw new NotFoundException('Persona no encontrada');

    const contacts = await this.contactoRepository.find({ where: { personaId } });
    return this.toUserResponse(persona, contacts);
  }

  private mapRhToDb(rh?: 'POSITIVE' | 'NEGATIVE'): FactorRh | null {
    if (rh === 'POSITIVE') return FactorRh.POSITIVO;
    if (rh === 'NEGATIVE') return FactorRh.NEGATIVO;
    return null;
  }

  private toUserResponse(persona: Persona, contacts: ContactoEmergencia[]): UserResponseDto {
    const emergencyContacts: EmergencyContactResponseDto[] = contacts.map((c) => ({
      uid: c.id,
      name: c.nombre,
      phoneNumber: c.telefono,
      relationship: c.parentesco,
    }));

    return {
      uid: persona.id,
      bloodTypeRh: persona.factorRh === FactorRh.POSITIVO ? 'POSITIVE'
                 : persona.factorRh === FactorRh.NEGATIVO ? 'NEGATIVE'
                 : null,
      bloodTypeLetter: persona.tipoSangre as 'A' | 'B' | 'AB' | 'O' | null,
      emergencyContacts,
      eps: persona.eps,
    };
  }
}
