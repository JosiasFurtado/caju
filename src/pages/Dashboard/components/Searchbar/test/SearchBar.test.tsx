import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SearchBar } from '../'
import { useRegistrations } from '~/context/Registrations'
import { useHistory } from 'react-router-dom'
import routes from '~/router/routes'
import '@testing-library/jest-dom'

jest.mock('~/context/Registrations')
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}))

describe('SearchBar', () => {
  const mockSearchRegistrations = jest.fn()
  const mockRefresh = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRegistrations as jest.Mock).mockReturnValue({
      searchRegistrations: mockSearchRegistrations,
      refresh: mockRefresh,
    })
    ;(useHistory as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('should render the CPF input and buttons', () => {
    render(<SearchBar />)

    expect(
      screen.getByPlaceholderText('Digite um CPF válido')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('refetch')).toBeInTheDocument()
    expect(screen.getByText('Nova Admissão')).toBeInTheDocument()
    expect(screen.getByLabelText('clear-search')).toBeInTheDocument()
  })

  it('should format the CPF correctly when typing', async () => {
    render(<SearchBar />)

    const cpfInput = screen.getByPlaceholderText('Digite um CPF válido')
    const clearButton = screen.getByLabelText('clear-search')

    expect(clearButton).toBeDisabled()

    fireEvent.change(cpfInput, { target: { value: '12345678901' } })

    await waitFor(() => {
      expect(cpfInput).toHaveValue('123.456.789-01')
      expect(clearButton).toBeEnabled()
    })
  })

  it('should call searchRegistrations when CPF has 14 characters (formatted)', async () => {
    render(<SearchBar />)

    const cpfInput = screen.getByPlaceholderText('Digite um CPF válido')

    fireEvent.change(cpfInput, { target: { value: '12345678901' } })

    await waitFor(() => {
      expect(cpfInput).toHaveValue('123.456.789-01')
      expect(mockSearchRegistrations).toHaveBeenCalledWith('12345678901')
    })
  })

  it('should enable the clear button when CPF has 14 characters and clear CPF when clicking it', async () => {
    render(<SearchBar />)

    const cpfInput = screen.getByPlaceholderText('Digite um CPF válido')
    const clearButton = screen.getByLabelText('clear-search')

    expect(clearButton).toBeDisabled()

    fireEvent.change(cpfInput, { target: { value: '12345678901' } })

    await waitFor(() => {
      expect(cpfInput).toHaveValue('123.456.789-01')
      expect(clearButton).toBeEnabled()
    })
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(cpfInput).toHaveValue('')
      expect(clearButton).toBeDisabled()
    })

    expect(mockRefresh).toHaveBeenCalled()
  })

  it('should call refresh when clicking the refresh button', () => {
    render(<SearchBar />)

    fireEvent.click(screen.getByLabelText('refetch'))

    expect(mockRefresh).toHaveBeenCalled()
  })

  it('should navigate to the new admission page when clicking "Nova Admissão"', () => {
    render(<SearchBar />)

    fireEvent.click(screen.getByText('Nova Admissão'))

    expect(mockPush).toHaveBeenCalledWith(routes.newUser)
  })
})
