import { Admission } from '~/types'
import * as S from './styles'
import RegistrationCard from '~/pages/Dashboard/components/RegistrationCard'
import { memo } from 'react'
import { useRegistrations } from '~/context/Registrations'
import Loading from '~/components/Loading'

const Column = ({
  column,
  getRegistrationsByStatus,
}: {
  column: { status: string; title: string }
  getRegistrationsByStatus: (status: string) => Admission[]
}) => {
  const registrations = getRegistrationsByStatus(column.status)
  const { isLoading } = useRegistrations()

  return (
    <S.Column status={column.status}>
      <>
        <S.TitleColumn status={column.status}>{column.title}</S.TitleColumn>
        <S.CollumContent>
          {isLoading ? (
            <Loading />
          ) : (
            registrations?.map(registration => (
              <RegistrationCard data={registration} key={registration.id} />
            ))
          )}
        </S.CollumContent>
      </>
    </S.Column>
  )
}

const MemoizedColumn = memo(Column)

export default MemoizedColumn
