import { ModalActionType, useModalContext } from '~/context/Modal'
import * as S from './styles'
import { useCallback, useMemo } from 'react'

const messagesByActionType: Record<ModalActionType, string> = {
  APPROVED: 'Tem certeza que deseja aprovar esse candidato?',
  REPROVED: 'Tem certeza que deseja reprovar esse candidato?',
  REVIEW: 'Tem certeza que deseja revisar novamente esse candidato?',
  DELETE: 'Tem certeza que deseja deletar essa candidatura?',
}

const ConfirmationModal: React.FC = () => {
  const { actionType, hideModal, onConfirm } = useModalContext()

  const message = useMemo(
    () => actionType && messagesByActionType[actionType],
    [actionType]
  )

  const handleConfirm = useCallback(() => {
    onConfirm()
    hideModal()
  }, [onConfirm, hideModal])

  if (!actionType) return null

  return (
    <S.ModalContainer>
      <S.ModalContent>
        <p>{message}</p>
        <S.ModalActions>
          <S.CancelAction onClick={hideModal}>Cancelar</S.CancelAction>
          <S.SubmitAction onClick={handleConfirm}>Confirmar</S.SubmitAction>
        </S.ModalActions>
      </S.ModalContent>
    </S.ModalContainer>
  )
}

export default ConfirmationModal
