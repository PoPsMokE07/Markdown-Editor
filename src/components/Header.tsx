import { useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import { useSelector } from 'react-redux'
import { RootState } from '../app/store'
import styled from 'styled-components'

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--background-color);
  height: 4rem;
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  @media (max-width: 480px) {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
`

const ExportButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  &:hover {
    background-color: var(--primary-hover);
  }
`

const ThemeButton = styled(Button)`
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  &:hover {
    background-color: var(--sidebar-background);
  }
`

const Header = () => {
  const activeDoc = useSelector((state: RootState) =>
    state.documents.documents.find(d => d.id === state.documents.activeId)
  )

  const [isDark, setIsDark] = useState(() =>
    localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    setIsDark(prev => !prev)
  }

  const exportMarkdown = () => {
    if (!activeDoc) return
    const blob = new Blob([activeDoc.content], { type: 'text/markdown' })
    saveAs(blob, `${activeDoc.title || 'document'}.md`)
  }

  return (
    <HeaderContainer>
      <Title>Markdown Editor</Title>
      <ButtonGroup>
        <ExportButton onClick={exportMarkdown}>
          Export .md
        </ExportButton>
        <ThemeButton onClick={toggleDarkMode}>
          {isDark ? '☀ Light Mode' : '🌙 Dark Mode'}
        </ThemeButton>
      </ButtonGroup>
    </HeaderContainer>
  )
}

export default Header
