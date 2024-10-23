import { createContext, useContext, useState } from 'react'
import ConfirmationModal from '~/components/ConfirmationModal'

export type ModalActionType = 'APPROVED' | 'REPROVED' | 'REVIEW' | 'DELETE'

interface ModalContextType {
  showModal: (actionType: ModalActionType, onConfirm: () => void) => void
  hideModal: () => void
  isVisible: boolean
  actionType: ModalActionType | undefined
  onConfirm: () => void | undefined
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
)

export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }
  return context
}

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actionType, setActionType] = useState<ModalActionType | undefined>(
    undefined
  )
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {})

  const showModal = (type: ModalActionType, confirmAction: () => void) => {
    setActionType(type)
    setOnConfirmAction(() => confirmAction)
    setIsVisible(true)
  }

  const hideModal = () => {
    setIsVisible(false)
    setActionType(undefined)
  }

  return (
    <ModalContext.Provider
      value={{
        showModal,
        hideModal,
        isVisible,
        actionType,
        onConfirm: onConfirmAction,
      }}
    >
      {children}
      {isVisible && <ConfirmationModal />}
    </ModalContext.Provider>
  )
}
