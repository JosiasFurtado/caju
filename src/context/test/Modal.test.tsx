import { render, fireEvent, screen } from '@testing-library/react'
import ConfirmationModal from '~/components/ConfirmationModal'
import { ModalActionType, ModalContext } from '~/context/Modal'
import '@testing-library/jest-dom'

describe('ModalContext and ConfirmationModal', () => {
  const mockHideModal = jest.fn()
  const mockOnConfirm = jest.fn()
  const showModal = jest.fn()

  const renderModal = (actionType: ModalActionType | undefined) => {
    render(
      <ModalContext.Provider
        value={{
          actionType,
          hideModal: mockHideModal,
          onConfirm: mockOnConfirm,
          isVisible: true,
          showModal,
        }}
      >
        <ConfirmationModal />
      </ModalContext.Provider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should not render modal with actionType is undefined', () => {
    renderModal(undefined)
    expect(screen.queryByText(/Tem certeza que deseja/i)).toBeNull()
  })

  it('Should render the correct message when actionType is "APPROVED"', () => {
    renderModal('APPROVED')
    expect(
      screen.getByText('Tem certeza que deseja aprovar esse candidato?')
    ).toBeInTheDocument()
  })

  it('Should render the correct message when actionType is "REPROVED"', () => {
    renderModal('REPROVED')
    expect(
      screen.getByText('Tem certeza que deseja reprovar esse candidato?')
    ).toBeInTheDocument()
  })

  it('Should call onConfirm and hideModal when "Confirmar" is clicked', () => {
    renderModal('APPROVED')

    fireEvent.click(screen.getByText('Confirmar'))

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  it('Should call hideModal when "Cancelar" is clicked', () => {
    renderModal('APPROVED')

    fireEvent.click(screen.getByText('Cancelar'))

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })
})
