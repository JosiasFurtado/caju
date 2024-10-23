import { ButtonSmall } from '~/components/Buttons'
import * as S from './styles'
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineTrash,
} from 'react-icons/hi'
import { Admission } from '~/types'
import { useRegistrations } from '~/context/Registrations'
import { useModalContext } from '~/context/Modal'

type Props = {
  data: Admission
}

const RegistrationCard = (props: Props) => {
  const { updateRegistration, deleteRegistration } = useRegistrations()
  const { showModal } = useModalContext()
  return (
    <S.Card>
      <S.IconAndText>
        <HiOutlineUser />
        <h3>{props.data.employeeName}</h3>
      </S.IconAndText>
      <S.IconAndText>
        <HiOutlineMail />
        <p>{props.data.email}</p>
      </S.IconAndText>
      <S.IconAndText>
        <HiOutlineCalendar />
        <span>{props.data.admissionDate}</span>
      </S.IconAndText>
      <S.Actions>
        <div>
          {props.data.status === 'REVIEW' && (
            <>
              <ButtonSmall
                onClick={() =>
                  showModal('REPROVED', () =>
                    updateRegistration(props.data, 'REPROVED')
                  )
                }
                bgcolor="rgb(255, 145, 154)"
              >
                Reprovar
              </ButtonSmall>
              <ButtonSmall
                onClick={() =>
                  showModal('APPROVED', () =>
                    updateRegistration(props.data, 'APPROVED')
                  )
                }
                bgcolor="rgb(155, 229, 155)"
              >
                Aprovar
              </ButtonSmall>
            </>
          )}
          {(props.data.status === 'APPROVED' ||
            props.data.status === 'REPROVED') && (
            <ButtonSmall
              onClick={() =>
                showModal('REVIEW', () =>
                  updateRegistration(props.data, 'REVIEW')
                )
              }
              bgcolor="#ff8858"
            >
              Revisar novamente
            </ButtonSmall>
          )}
        </div>
        <S.ButtonDelete
          data-testid="delete-button"
          onClick={() =>
            showModal('DELETE', () => deleteRegistration(props.data))
          }
        >
          <HiOutlineTrash />
        </S.ButtonDelete>
      </S.Actions>
    </S.Card>
  )
}

export default RegistrationCard
