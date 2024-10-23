import { HiRefresh, HiX } from 'react-icons/hi'
import { useHistory } from 'react-router-dom'
import Button from '~/components/Buttons'
import { IconButton } from '~/components/Buttons/IconButton'
import TextField from '~/components/TextField'
import routes from '~/router/routes'
import * as S from './styles'
import { useRegistrations } from '~/context/Registrations'
import { useForm } from 'react-hook-form'
import { formatCpf } from '~/utils/formatString'

export const SearchBar = () => {
  const { register, setValue, watch } = useForm()
  const { refresh, searchRegistrations } = useRegistrations()
  const history = useHistory()

  const goToNewAdmissionPage = () => {
    history.push(routes.newUser)
  }

  const handleSearch = (cpf: string) => {
    if (cpf.length === 11) {
      searchRegistrations(cpf)
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCpf(e.target.value)

    setValue('cpf', value)
    if (value.length === 14) {
      handleSearch(value.replace(/\D/g, ''))
    }
  }

  const cpfValue = watch('cpf') || ''
  const activeClearButton = cpfValue.length === 14

  const handleClearSearch = () => {
    setValue('cpf', '')
    refresh()
  }
  return (
    <S.Container>
      <S.SearchContainer>
        <TextField
          id="cpf"
          placeholder="Digite um CPF válido"
          maxLength={14}
          value={cpfValue}
          {...register('cpf', { onChange: handleCpfChange })}
        />
        <button
          disabled={!activeClearButton}
          aria-label="clear-search"
          onClick={handleClearSearch}
        >
          <HiX />
        </button>
      </S.SearchContainer>
      <S.Actions>
        <IconButton onClick={() => refresh()} aria-label="refetch">
          <HiRefresh />
        </IconButton>
        <Button onClick={() => goToNewAdmissionPage()}>Nova Admissão</Button>
      </S.Actions>
    </S.Container>
  )
}
