import Router from '~/router'
import { Header } from './components/Header'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { RegistrationsProvider } from './context/Registrations'
import { ModalProvider } from './context/Modal'

function App() {
  return (
    <ModalProvider>
      <RegistrationsProvider>
        <ToastContainer />
        <Header>
          <h1>Caju Front Teste</h1>
        </Header>
        <Router />
      </RegistrationsProvider>
    </ModalProvider>
  )
}

export default App
