import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Document } from './types'

const loadFromLocalStorage = (): Document[] => {
  const data = localStorage.getItem('documents')
  return data ? JSON.parse(data) : []
}

const saveToLocalStorage = (docs: Document[]) => {
  localStorage.setItem('documents', JSON.stringify(docs))
}

const loadActiveIdFromLocalStorage = (): string | null => {
  return localStorage.getItem('activeId') || null
}

const saveActiveIdToLocalStorage = (activeId: string | null) => {
  if (activeId) {
    localStorage.setItem('activeId', activeId)
  } else {
    localStorage.removeItem('activeId')
  }
}

interface DocumentsState {
  documents: Document[]
  activeId: string | null
  search: string
}

const initialState: DocumentsState = {
  documents: loadFromLocalStorage(),
  activeId: loadActiveIdFromLocalStorage(),
  search: '',
}

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    createDocument(state) {
      const count = state.documents.length + 1
      const newDoc: Document = {
        id: crypto.randomUUID(),
        title: `Untitled Document ${count}`,
        content: '',
        createdAt: new Date().toISOString(),
      }
      state.documents.push(newDoc)
      state.activeId = newDoc.id
      saveToLocalStorage(state.documents)
      saveActiveIdToLocalStorage(state.activeId)
    },
    deleteDocument(state, action: PayloadAction<string>) {
      state.documents = state.documents.filter(doc => doc.id !== action.payload)
      if (state.activeId === action.payload) {
        state.activeId = null
      }
      saveToLocalStorage(state.documents)
      saveActiveIdToLocalStorage(state.activeId)
    },
    setActiveDocument(state, action: PayloadAction<string>) {
      state.activeId = action.payload
      saveActiveIdToLocalStorage(state.activeId)
    },
    updateContent(state, action: PayloadAction<{ id: string; content: string }>) {
      const doc = state.documents.find(d => d.id === action.payload.id)
      if (doc) {
        doc.content = action.payload.content
        saveToLocalStorage(state.documents)
      }
    },
    updateTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const doc = state.documents.find(d => d.id === action.payload.id)
      if (doc) {
        doc.title = action.payload.title
        saveToLocalStorage(state.documents)
      }
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
  },
})

export const {
  createDocument,
  deleteDocument,
  setActiveDocument,
  updateContent,
  updateTitle,
  setSearch,
} = documentsSlice.actions

export default documentsSlice.reducer
