import TextField from '~/components/TextField'
import * as S from './styles'
import Button from '~/components/Buttons'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { IconButton } from '~/components/Buttons/IconButton'
import { useHistory } from 'react-router-dom'
import routes from '~/router/routes'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { formatCpf, formatDate } from '~/utils/formatString'
import { useRegistrations } from '~/context/Registrations'
import { CPF_REGEX, EMAIL_REGEX } from '~/utils/regex'
import Loading from '~/components/Loading'

const newRegistrationSchema = yup
  .object({
    employeeName: yup
      .string()
      .min(2, 'Nome deve ter no mínimo 2 caracteres')
      .required('Nome é obrigatório'),
    email: yup
      .string()
      .required('Email é obrigatório')
      .matches(EMAIL_REGEX, 'Email inválido'),
    cpf: yup
      .string()
      .required('CPF é obrigatório')
      .matches(CPF_REGEX, 'CPF inválido'),
    admissionDate: yup
      .date()
      .typeError('Escolha uma data válida')
      .max(new Date(), 'Você não pode escolher uma data futura')
      .required('Data de admissão é obrigatório'),
  })
  .required()
type FormData = yup.InferType<typeof newRegistrationSchema>

const NewUserPage = () => {
  const { addRegistration, isLoading } = useRegistrations()
  const history = useHistory()
  const goToHome = () => {
    history.push(routes.dashboard)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(newRegistrationSchema),
  })
  const onSubmit = async (data: FormData) => {
    const cpf = data.cpf.replace(/\D/g, '')
    const admissionDate = formatDate(data.admissionDate.toString())
    await addRegistration({
      ...data,
      cpf,
      admissionDate,
      status: 'REVIEW',
    })
    goToHome()
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCpf(e.target.value)

    setValue('cpf', value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^a-zA-Z ]/g, '')
    value = value.replace(/(?<![a-zA-Z]{2}) /g, '')
    setValue('employeeName', value)
  }

  return (
    <S.Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <S.Card>
          <IconButton onClick={() => goToHome()} aria-label="back">
            <HiOutlineArrowLeft size={24} />
          </IconButton>

          <TextField
            {...register('employeeName', {
              onChange: handleNameChange,
            })}
            placeholder="Nome"
            label="Nome"
            error={errors.employeeName?.message}
          />
          <TextField
            {...register('email')}
            placeholder="Email"
            label="Email"
            type="email"
            error={errors.email?.message}
          />
          <TextField
            {...register('cpf', { onChange: handleCpfChange })}
            placeholder="CPF"
            label="CPF"
            maxLength={14}
            error={errors.cpf?.message}
          />
          <TextField
            {...register('admissionDate')}
            label="Data de admissão"
            aria-label="admissionDate"
            type="date"
            error={errors.admissionDate?.message}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loading /> : 'Cadastrar'}
          </Button>
        </S.Card>
      </form>
    </S.Container>
  )
}

export default NewUserPage
