import { useDispatch, useSelector } from 'react-redux'
import {
  createDocument,
  setSearch,
  setActiveDocument,
} from '../features/documents/documentsSlice'
import { RootState } from '../app/store'
import DocumentItem from './DocumentItem'
import styled from 'styled-components'
import { useState } from 'react'

const SidebarContainer = styled.aside`
  width: 300px;
  border-right: 1px solid var(--border-color);
  padding: 1rem;
  overflow-y: auto;
  background-color: var(--sidebar-background);
  color: var(--text-color);

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--background-color);
  color: var(--text-color);
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`

const NewDocumentButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: var(--primary-hover);
  }
`

const SortButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: var(--sidebar-background);
  }
`

const Sidebar = () => {
  const dispatch = useDispatch()
  const { documents, search } = useSelector((state: RootState) => state.documents)
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')

  const filteredDocs = documents
    .filter(doc => doc.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.title.localeCompare(b.title)
    })

  const handleCreateDocument = () => {
    dispatch(createDocument())
    setTimeout(() => {
      const lastDoc = filteredDocs[filteredDocs.length - 1]
      if (lastDoc) {
        dispatch(setActiveDocument(lastDoc.id))
      }
    }, 0)
  }

  return (
    <SidebarContainer>
      <NewDocumentButton onClick={handleCreateDocument}>
        + New Document
      </NewDocumentButton>
      <SearchInput
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={e => dispatch(setSearch(e.target.value))}
      />
      <SortButton onClick={() => setSortBy(prev => prev === 'date' ? 'title' : 'date')}>
        Sort by: {sortBy === 'date' ? 'Date' : 'Title'}
      </SortButton>
      <div className="space-y-2">
        {filteredDocs.map(doc => (
          <DocumentItem key={doc.id} document={doc} />
        ))}
      </div>
    </SidebarContainer>
  )
}

export default Sidebar
