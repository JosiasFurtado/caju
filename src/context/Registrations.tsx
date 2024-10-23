import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchAPI } from '~/utils/fetch'
import { Admission, NewAdmission } from '~/types'
import { API_URL } from '~/utils/constants'

interface IRegistrationsContext {
  registrations: Admission[]
  isLoading: boolean
  updateRegistration: (
    registration: Admission,
    newStatus: string
  ) => Promise<void>
  refresh: () => Promise<void>
  searchRegistrations: (cpf: string) => Promise<void>
  deleteRegistration: (registration: Admission) => Promise<void>
  addRegistration: (registration: NewAdmission) => Promise<void>
}

interface RegistrationsProviderProps {
  children: React.ReactNode
}

export const RegistrationsContext = createContext<IRegistrationsContext>({
  registrations: [],
  isLoading: true,
  updateRegistration: async () => {},
  refresh: async () => {},
  searchRegistrations: async () => {},
  deleteRegistration: async () => {},
  addRegistration: async () => {},
})

export const useRegistrations = () => {
  const context = useContext(RegistrationsContext)
  if (!context) {
    throw new Error(
      'useRegistrations must be used within a RegistrationsProvider'
    )
  }
  return context
}

export const RegistrationsProvider: React.FC<RegistrationsProviderProps> = ({
  children,
}) => {
  const [registrations, setRegistrations] = useState<Admission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getRegistrationsOrRefresh = async (withoutToast?: boolean) => {
    try {
      const response = await fetchAPI<Admission[]>(`${API_URL}/registrations`)
      setRegistrations(response)
      setIsLoading(false)
      if (!withoutToast) {
        toast.success('Registros carregados')
      }
    } catch (error) {
      toast.error(`Erro ao buscar registros: ${error}`)
      setIsLoading(false)
    }
  }

  const addRegistration = async (registration: NewAdmission) => {
    setIsLoading(true)
    try {
      await fetchAPI<Admission>(`${API_URL}/registrations`, {
        method: 'POST',
        body: JSON.stringify(registration),
      })
      await getRegistrationsOrRefresh(true)
      toast.success('Registro adicionado com sucesso')
    } catch (error) {
      toast.error(`Erro ao adicionar registro: ${error}`)
      setIsLoading(false)
    }
  }
  const updateRegistration = async (
    registration: Admission,
    newStatus: string
  ) => {
    try {
      await fetchAPI<Admission>(`${API_URL}/registrations/${registration.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...registration, status: newStatus }),
      })
      setIsLoading(true)
      await getRegistrationsOrRefresh(true)
      toast.success('Registro atualizado com sucesso')
    } catch (error) {
      toast.error(`Erro ao atualizar registro: ${error}`)
    }
  }

  const deleteRegistration = async (registration: Admission) => {
    try {
      await fetchAPI<Admission>(`${API_URL}/registrations/${registration.id}`, {
        method: 'DELETE',
      })
      setIsLoading(true)
      await getRegistrationsOrRefresh(true)
      toast.success('Registro deletado com sucesso')
    } catch (error) {
      toast.error(`Erro ao deletar registro: ${error}`)
      setIsLoading(false)
    }
  }

  const searchRegistrations = async (cpf: string) => {
    setIsLoading(true)
    try {
      const response = await fetchAPI<Admission[]>(
        `${API_URL}/registrations?cpf=${cpf}`
      )

      setIsLoading(false)
      if (response.length === 0) {
        setRegistrations([])
        toast.info('Nenhum registro encontrado')
        return
      }
      setRegistrations(response)
    } catch (error) {
      toast.error(`Erro ao buscar registros: ${error}`)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (registrations.length === 0) {
      getRegistrationsOrRefresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <RegistrationsContext.Provider
      value={{
        registrations,
        refresh: getRegistrationsOrRefresh,
        updateRegistration,
        searchRegistrations,
        deleteRegistration,
        addRegistration,
        isLoading,
      }}
    >
      {children}
    </RegistrationsContext.Provider>
  )
}
