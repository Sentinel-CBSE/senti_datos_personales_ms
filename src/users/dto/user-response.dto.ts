export class EmergencyContactResponseDto {
  uid: string;
  name: string;
  phoneNumber: string;
  relationship: string;
}

export class UserResponseDto {
  uid: string;
  bloodTypeRh: 'POSITIVE' | 'NEGATIVE' | null;
  bloodTypeLetter: 'A' | 'B' | 'AB' | 'O' | null;
  emergencyContacts: EmergencyContactResponseDto[];
  eps: string | null;
}
