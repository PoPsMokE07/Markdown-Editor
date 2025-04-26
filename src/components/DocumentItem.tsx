import { useDispatch, useSelector } from 'react-redux'
import {
  deleteDocument,
  setActiveDocument,
  updateTitle,
} from '../features/documents/documentsSlice'
import { Document } from '../features/documents/types'
import { RootState } from '../app/store'
import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'

const DocumentItemContainer = styled.div<{ isActive: boolean }>`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.isActive ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${props => props.isActive ? 'white' : 'var(--text-color)'};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${props => props.isActive ? 'var(--primary-hover)' : 'var(--sidebar-background)'};
    border-color: var(--primary-color);
  }
`

const TitleInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: inherit;
  &:focus {
    outline: none;
  }
`

const Metadata = styled.div`
  font-size: 0.75rem;
  color: inherit;
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const DeleteButton = styled.button`
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
  ${DocumentItemContainer}:hover & {
    opacity: 1;
  }
  &:hover {
    opacity: 1;
  }
`

interface Props {
  document: Document
}

const DocumentItem = ({ document }: Props) => {
  const dispatch = useDispatch()
  const activeId = useSelector((state: RootState) => state.documents.activeId)
  const isActive = document.id === activeId
  const [isEditing, setIsEditing] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    dispatch(setActiveDocument(document.id))
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTitle({ id: document.id, title: e.target.value }))
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this document?')) {
      dispatch(deleteDocument(document.id))
    }
  }

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isEditing])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <DocumentItemContainer isActive={isActive} onClick={handleClick}>
      <TitleInput
        ref={titleInputRef}
        value={document.title}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        onClick={handleTitleClick}
        readOnly={!isEditing}
      />
      <Metadata>
        <span>{formatDate(document.createdAt)}</span>
        <DeleteButton onClick={handleDelete} title="Delete document">
          🗑️
        </DeleteButton>
      </Metadata>
    </DocumentItemContainer>
  )
}

export default DocumentItem
