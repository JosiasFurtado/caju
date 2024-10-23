import styled from 'styled-components'

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`
export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  p {
    font-size: 18px;
  }
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  button {
    color: white;
    font-size: 12px;
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
  }
`

export const SubmitAction = styled.button`
  background-color: #64a98c;
`
export const CancelAction = styled.button`
  background-color: #f44336;
`
