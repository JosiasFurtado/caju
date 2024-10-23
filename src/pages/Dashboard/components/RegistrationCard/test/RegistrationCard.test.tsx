import { render, screen, fireEvent } from '@testing-library/react'
import RegistrationCard from '~/pages/Dashboard/components/RegistrationCard'
import { useRegistrations } from '~/context/Registrations'
import { useModalContext } from '~/context/Modal'
import { Admission, AdmissionsStatus } from '~/types'
import '@testing-library/jest-dom'

jest.mock('~/context/Registrations', () => ({
  useRegistrations: jest.fn(),
}))

jest.mock('~/context/Modal', () => ({
  useModalContext: jest.fn(),
}))

const mockUpdateRegistration = jest.fn()
const mockDeleteRegistration = jest.fn()
const mockShowModal = jest.fn()

describe('RegistrationCard', () => {
  beforeEach(() => {
    ;(useRegistrations as jest.Mock).mockReturnValue({
      updateRegistration: mockUpdateRegistration,
      deleteRegistration: mockDeleteRegistration,
    })
    ;(useModalContext as jest.Mock).mockReturnValue({
      showModal: mockShowModal,
    })
  })

  const mockAdmission: Admission = {
    employeeName: 'John Doe',
    email: 'john@example.com',
    admissionDate: '2024-10-01',
    status: 'REVIEW',
    id: '1',
    cpf: '1234567890',
  }

  it('should render employee name, email, and admission date', () => {
    render(<RegistrationCard data={mockAdmission} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('2024-10-01')).toBeInTheDocument()
  })

  it('should render "Aprovar" and "Reprovar" buttons when status is REVIEW', () => {
    render(<RegistrationCard data={mockAdmission} />)

    expect(screen.getByText('Aprovar')).toBeInTheDocument()
    expect(screen.getByText('Reprovar')).toBeInTheDocument()
  })

  it('should call showModal with "APPROVED" when "Aprovar" is clicked', () => {
    render(<RegistrationCard data={mockAdmission} />)

    fireEvent.click(screen.getByText('Aprovar'))

    expect(mockShowModal).toHaveBeenCalledWith('APPROVED', expect.any(Function))
  })

  it('should call showModal with "REPROVED" when "Reprovar" is clicked', () => {
    render(<RegistrationCard data={mockAdmission} />)

    fireEvent.click(screen.getByText('Reprovar'))

    expect(mockShowModal).toHaveBeenCalledWith('REPROVED', expect.any(Function))
  })

  it('should render "Revisar novamente" when status is APPROVED', () => {
    const approvedAdmission: Admission = {
      ...mockAdmission,
      status: 'APPROVED' as AdmissionsStatus,
    }
    render(<RegistrationCard data={approvedAdmission} />)

    expect(screen.getByText('Revisar novamente')).toBeInTheDocument()
  })

  it('should call showModal with "DELETE" when delete button is clicked', () => {
    render(<RegistrationCard data={mockAdmission} />)

    fireEvent.click(screen.getByTestId('delete-button'))

    expect(mockShowModal).toHaveBeenCalledWith('DELETE', expect.any(Function))
  })
})
