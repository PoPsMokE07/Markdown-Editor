import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import styled from 'styled-components'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const App = () => {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Sidebar />
        <Editor />
      </MainContent>
    </AppContainer>
  )
}

export default App
