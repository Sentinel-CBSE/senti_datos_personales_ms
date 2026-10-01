export class EmergencyContactResponseDto {
  uid: string;
  name: string;
  phoneNumber: string;
  relationship: string;
}

export class UserResponseDto {
  uid: string;
  email: string;
  photoUrl: null;
  displayName: string;
  isAnonymous: boolean;
  isEmailVerified: boolean;
  bloodTypeRh: 'POSITIVE' | 'NEGATIVE' | null;
  bloodTypeLetter: 'A' | 'B' | 'AB' | 'O' | null;
  emergencyContacts: EmergencyContactResponseDto[];
  eps: string | null;
}
