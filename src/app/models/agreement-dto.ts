export class AgreementDTO {
  id: number;
  startDate: Date;
  endDate: Date;
  companyName: string;
  companyRepresentative: string;
  agreementState: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'APPROVED';
}
