import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewUserPage from '~/pages/NewUser'
import { useRegistrations } from '~/context/Registrations'
import { useHistory } from 'react-router-dom'
import '@testing-library/jest-dom'
import routes from '~/router/routes'

jest.mock('~/context/Registrations')
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}))

describe('NewUserPage', () => {
  const mockAddRegistration = jest.fn()
  const mockHistoryPush = jest.fn()

  beforeEach(() => {
    ;(useRegistrations as jest.Mock).mockReturnValue({
      addRegistration: mockAddRegistration,
      isLoading: false,
    })
    ;(useHistory as jest.Mock).mockReturnValue({
      push: mockHistoryPush,
    })
  })

  it('should render the form elements correctly', () => {
    render(<NewUserPage />)

    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('CPF')).toBeInTheDocument()
    expect(screen.getByLabelText('admissionDate')).toBeInTheDocument()
  })

  it('should show validation errors for required fields', async () => {
    render(<NewUserPage />)

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }))

    await waitFor(() => {
      expect(
        screen.getByText(content =>
          content.includes('Nome deve ter no mínimo 2 caracteres')
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText(content => content.includes('Email é obrigatório'))
      ).toBeInTheDocument()
      expect(
        screen.getByText(content => content.includes('CPF é obrigatório'))
      ).toBeInTheDocument()
      expect(
        screen.getByText(content => content.includes('Escolha uma data válida'))
      ).toBeInTheDocument()
    })
  })

  it('should format CPF input correctly', () => {
    render(<NewUserPage />)

    const cpfInput = screen.getByPlaceholderText('CPF')
    fireEvent.change(cpfInput, { target: { value: '12345678901' } })

    expect(cpfInput).toHaveValue('123.456.789-01')
  })

  it('should call addRegistration with correct data when form is submitted and redirect to dashboard', async () => {
    render(<NewUserPage />)

    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('CPF'), {
      target: { value: '12345678901' },
    })
    fireEvent.change(screen.getByLabelText('admissionDate'), {
      target: { value: '2020-01-01' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }))

    await waitFor(() => {
      expect(mockAddRegistration).toHaveBeenCalledWith({
        employeeName: 'John Doe',
        email: 'john.doe@example.com',
        cpf: '12345678901',
        admissionDate: '01/01/2020',
        status: 'REVIEW',
      })
      expect(mockHistoryPush).toHaveBeenCalledWith(routes.dashboard)
    })
  })
})
