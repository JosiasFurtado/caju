import styled from 'styled-components'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
`

const Svg = styled(AiOutlineLoading3Quarters)`
  animation: rotation 2s infinite linear;
  -webkit-animation: rotation 2s infinite linear;
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`
export const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <Svg size={40} />
    </LoadingContainer>
  )
}

Loading.displayName = 'Loading'
export default Loading
