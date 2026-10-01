import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  extractFirebaseInfo(authHeader: string | undefined): { uid: string; email: string } {
    if (!authHeader) throw new UnauthorizedException('Authorization header requerido');
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const parts = token.split('.');
    if (parts.length < 2) throw new UnauthorizedException('Token inválido');

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token sin uid o email');
    }
    return { uid: payload.sub as string, email: payload.email as string };
  }

  async upsertProfile(uid: string, email: string, dto: UserUpdateBodyDto): Promise<UserResponseDto> {
    let persona = await this.personaRepository.findOne({ where: { id: uid } });

    if (!persona) {
      persona = this.personaRepository.create({
        id: uid,
        correo: email,
        nombre: dto.displayName ?? '',
        tipoSangre: dto.bloodTypeLetter ? (dto.bloodTypeLetter as unknown as TipoSangre) : null,
        factorRh: this.mapRhToDb(dto.bloodTypeRh),
        eps: dto.eps ?? null,
      });
    } else {
      if (dto.displayName !== undefined) persona.nombre = dto.displayName;
      if (dto.bloodTypeLetter !== undefined) persona.tipoSangre = dto.bloodTypeLetter as unknown as TipoSangre;
      if (dto.bloodTypeRh !== undefined) persona.factorRh = this.mapRhToDb(dto.bloodTypeRh);
      if (dto.eps !== undefined) persona.eps = dto.eps;
    }

    await this.personaRepository.save(persona);
    const contacts = await this.contactoRepository.find({ where: { personaId: uid } });
    return this.toUserResponse(persona, contacts);
  }

  async addEmergencyContact(uid: string, email: string, dto: EmergencyContactRequestDto): Promise<UserResponseDto> {
    let persona = await this.personaRepository.findOne({ where: { id: uid } });

    if (!persona) {
      persona = this.personaRepository.create({ id: uid, correo: email, nombre: '' });
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

  async updateEmergencyContact(contactId: string, dto: EmergencyContactRequestDto): Promise<UserResponseDto> {
    const contacto = await this.contactoRepository.findOne({ where: { id: contactId } });
    if (!contacto) throw new NotFoundException(`Contacto ${contactId} no encontrado`);

    contacto.nombre = dto.name;
    contacto.telefono = dto.phoneNumber;
    contacto.parentesco = dto.relationship;
    await this.contactoRepository.save(contacto);

    const persona = await this.personaRepository.findOne({ where: { id: contacto.personaId } });
    if (!persona) throw new NotFoundException('Persona no encontrada');

    const contacts = await this.contactoRepository.find({ where: { personaId: persona.id } });
    return this.toUserResponse(persona, contacts);
  }

  async deleteEmergencyContact(contactId: string): Promise<UserResponseDto> {
    const contacto = await this.contactoRepository.findOne({ where: { id: contactId } });
    if (!contacto) throw new NotFoundException(`Contacto ${contactId} no encontrado`);

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
      email: persona.correo,
      photoUrl: null,
      displayName: persona.nombre,
      isAnonymous: false,
      isEmailVerified: true,
      bloodTypeRh: persona.factorRh === FactorRh.POSITIVO ? 'POSITIVE'
                 : persona.factorRh === FactorRh.NEGATIVO ? 'NEGATIVE'
                 : null,
      bloodTypeLetter: persona.tipoSangre as 'A' | 'B' | 'AB' | 'O' | null,
      emergencyContacts,
      eps: persona.eps,
    };
  }
}
