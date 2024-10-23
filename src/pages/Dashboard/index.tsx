import Collumns from './components/Columns'
import * as S from './styles'
import { SearchBar } from './components/Searchbar'
import { useRegistrations } from '~/context/Registrations'

const DashboardPage = () => {
  const { registrations } = useRegistrations()

  return (
    <S.Container>
      <SearchBar />
      <Collumns registrations={registrations} />
    </S.Container>
  )
}
export default DashboardPage
