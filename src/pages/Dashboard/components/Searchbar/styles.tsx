import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  button {
    border: 1px solid red;
    border-radius: 100%;
    background: none;
    color: red;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button:disabled {
    cursor: not-allowed;
    color: #ccc;
    border-color: #ccc;
  }
`
