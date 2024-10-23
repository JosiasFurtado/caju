import * as S from './styles'
import { useCallback } from 'react'
import { Admission } from '~/types'
import Column from './Column'

const allColumns = [
  { status: 'REVIEW', title: 'Pronto para revisar' },
  { status: 'APPROVED', title: 'Aprovado' },
  { status: 'REPROVED', title: 'Reprovado' },
]

type StatusType = (typeof allColumns)[number]['status']

interface CollumnsProps {
  registrations: Admission[]
}

const Collumns: React.FC<CollumnsProps> = ({ registrations }) => {
  const getRegistrations = useCallback(
    (status: StatusType) => {
      return registrations.filter(
        registration => registration.status === status
      )
    },
    [registrations]
  )

  return (
    <S.Container>
      {allColumns.map(column => (
        <Column
          key={column.title}
          column={column}
          getRegistrationsByStatus={() => getRegistrations(column.status)}
        />
      ))}
    </S.Container>
  )
}

export default Collumns
