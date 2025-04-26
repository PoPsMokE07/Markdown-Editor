import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/store'
import { updateContent } from '../features/documents/documentsSlice'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

const EditorContainer = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 4rem);
  overflow: hidden;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 300px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 300px;
`

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  padding: 1rem;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  overflow-y: auto;
  color: var(--text-color);
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`

const Editor = () => {
  const dispatch = useDispatch()
  const activeDoc = useSelector((state: RootState) =>
    state.documents.documents.find(d => d.id === state.documents.activeId)
  )

  const [localContent, setLocalContent] = useState('')

  useEffect(() => {
    setLocalContent(activeDoc?.content || '')
  }, [activeDoc?.id, activeDoc?.content])

  const debouncedContent = useDebounce(localContent, 500)

  useEffect(() => {
    if (activeDoc && debouncedContent !== undefined) {
      dispatch(updateContent({ id: activeDoc.id, content: debouncedContent }))
    }
  }, [debouncedContent, dispatch, activeDoc])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value)
  }

  if (!activeDoc) {
    return (
      <div className="flex-1 p-6 text-gray-500 dark:text-gray-400">
        Select or create a document to start editing...
      </div>
    )
  }

  return (
    <EditorContainer>
      <EditorSection>
        <TextArea
          value={localContent}
          onChange={handleChange}
          placeholder="Write markdown here..."
        />
      </EditorSection>
      <PreviewSection>
        <PreviewContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {localContent}
          </ReactMarkdown>
        </PreviewContainer>
      </PreviewSection>
    </EditorContainer>
  )
}

export default Editor
