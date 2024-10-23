import { InputHTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'

export const Input = styled.input`
  padding: 0 8px;
  vertical-align: middle;
  border-radius: 2px;
  width: 100%;
  min-height: 36px;
  background-color: #ffffff;
  border: 1px solid rgba(36, 28, 21, 0.3);
  transition: all 0.2s ease-in-out 0s;
  font-size: 16px;
  line-height: 18px;
  font-weight: normal;
  border-radius: 8px;
  :focus {
    outline: none;
    border: 1px solid #007c89;
    box-shadow: inset 0 0 0 1px #007c89;
  }
`

export const ErrorMessage = styled.span`
  font-size: 12px;
  color: red;
`

type Props = {
  label?: string
  error?: string
} & InputHTMLAttributes<any>

const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        {label && <label htmlFor={props.id}>{label}</label>}
        <Input ref={ref} {...props} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>
    )
  }
)

export default TextField
