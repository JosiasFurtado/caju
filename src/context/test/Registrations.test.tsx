import { render, renderHook, act, waitFor } from '@testing-library/react'
import { RegistrationsProvider, useRegistrations } from '../Registrations'
import { fetchAPI } from '~/utils/fetch'
import { toast } from 'react-toastify'
import { Admission, NewAdmission } from '~/types'
import { API_URL } from '~/utils/constants'

jest.mock('~/utils/fetch')
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}))

describe('RegistrationsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockRegistrations: Admission[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      email: 'john@example.com',
      admissionDate: '2024-10-01',
      status: 'REVIEW',
      cpf: '12345678901',
    },
  ]

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <RegistrationsProvider>{children}</RegistrationsProvider>
  )

  function setupTestComponent() {
    let contextValues: ReturnType<typeof useRegistrations> | undefined

    function TestComponent() {
      contextValues = useRegistrations()
      return null
    }

    render(
      <RegistrationsProvider>
        <TestComponent />
      </RegistrationsProvider>
    )

    return () => contextValues
  }

  it('should fetch and set registrations on mount', async () => {
    ;(fetchAPI as jest.Mock).mockResolvedValueOnce(mockRegistrations)

    const getContextValues = setupTestComponent()

    await waitFor(() => {
      expect(getContextValues()?.isLoading).toBe(false)
    })

    expect(fetchAPI).toHaveBeenCalledWith(`${API_URL}/registrations`)
    expect(getContextValues()?.registrations).toEqual(mockRegistrations)
    expect(toast.success).toHaveBeenCalledWith('Registros carregados')
  })

  it('should handle fetch error on mount', async () => {
    const errorMessage = 'Network Error'
    ;(fetchAPI as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const getContextValues = setupTestComponent()

    await waitFor(() => {
      expect(getContextValues()?.isLoading).toBe(false)
    })

    expect(fetchAPI).toHaveBeenCalledWith(`${API_URL}/registrations`)
    expect(getContextValues()?.isLoading).toBe(false)
    expect(toast.error).toHaveBeenCalledWith(
      `Erro ao buscar registros: Error: ${errorMessage}`
    )
  })

  it('should add a new registration', async () => {
    const newRegistration: NewAdmission = {
      employeeName: 'Jane Doe',
      email: 'jane@example.com',
      admissionDate: '2024-11-01',
      cpf: '09876543210',
      status: 'REVIEW',
    }

    ;(fetchAPI as jest.Mock)
      .mockResolvedValueOnce(mockRegistrations)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([
        ...mockRegistrations,
        { ...newRegistration, id: '99' },
      ])

    const { result } = renderHook(() => useRegistrations(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.registrations).toEqual(mockRegistrations)

    await act(async () => {
      await result.current.addRegistration(newRegistration)
    })

    await waitFor(() => {
      expect(result.current.registrations).toEqual([
        ...mockRegistrations,
        { ...newRegistration, id: '99' },
      ])
    })

    expect(fetchAPI).toHaveBeenCalledWith(`${API_URL}/registrations`, {
      method: 'POST',
      body: JSON.stringify(newRegistration),
    })
    expect(toast.success).toHaveBeenCalledWith(
      'Registro adicionado com sucesso'
    )
  })

  it('should update a registration', async () => {
    const updatedRegistration = { ...mockRegistrations[0], status: 'APPROVED' }

    ;(fetchAPI as jest.Mock)
      .mockResolvedValueOnce(mockRegistrations)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([updatedRegistration])

    const { result } = renderHook(() => useRegistrations(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.updateRegistration(mockRegistrations[0], 'APPROVED')
    })

    await waitFor(() => {
      expect(result.current.registrations).toEqual([updatedRegistration])
    })

    expect(fetchAPI).toHaveBeenCalledWith(
      `${API_URL}/registrations/${mockRegistrations[0].id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedRegistration),
      }
    )
    expect(toast.success).toHaveBeenCalledWith(
      'Registro atualizado com sucesso'
    )
  })

  it('should delete a registration', async () => {
    ;(fetchAPI as jest.Mock)
      .mockResolvedValueOnce(mockRegistrations)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([])

    const { result } = renderHook(() => useRegistrations(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.deleteRegistration(mockRegistrations[0])
    })

    await waitFor(() => {
      expect(result.current.registrations).toEqual([])
    })

    expect(fetchAPI).toHaveBeenCalledWith(
      `${API_URL}/registrations/${mockRegistrations[0].id}`,
      {
        method: 'DELETE',
      }
    )
    expect(toast.success).toHaveBeenCalledWith('Registro deletado com sucesso')
  })

  it('should search for registrations by CPF', async () => {
    ;(fetchAPI as jest.Mock).mockResolvedValueOnce(mockRegistrations)

    const getContextValues = setupTestComponent()

    await act(async () => {
      await getContextValues()?.searchRegistrations('12345678901')
    })

    await waitFor(() => {
      expect(getContextValues()?.registrations).toEqual(mockRegistrations)
    })

    expect(fetchAPI).toHaveBeenCalledWith(
      `${API_URL}/registrations?cpf=12345678901`
    )
  })

  it('should handle no registrations found in search', async () => {
    ;(fetchAPI as jest.Mock)
      .mockResolvedValueOnce(mockRegistrations)
      .mockResolvedValueOnce([])

    const { result } = renderHook(() => useRegistrations(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.searchRegistrations('00000000000')
    })

    await waitFor(() => {
      expect(result.current.registrations).toEqual([])
    })

    expect(fetchAPI).toHaveBeenCalledWith(
      `${API_URL}/registrations?cpf=00000000000`
    )
    expect(toast.info).toHaveBeenCalledWith('Nenhum registro encontrado')
  })
})
