export type AdmissionsStatus = 'REVIEW' | 'APPROVED' | 'REPROVED'

export interface Admission {
  id: string
  admissionDate?: string
  email: string
  employeeName: string
  status: AdmissionsStatus
  cpf: string
}

export type NewAdmission = Omit<Admission, 'id'>
