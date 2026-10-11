import { createContext, useContext, type Dispatch } from 'react'
import type { Dictionary } from '@/shared/i18n/en'
import type { MenuItem } from './ContextMenu'
import type { Action, State } from './editorState'

export type EditorContextValue = {
  state: State
  dispatch: Dispatch<Action>
  text: Dictionary['flowEditor']
  search: string
  showLabels: boolean
  reducedMotion: boolean
  openMenu: (anchor: HTMLElement | { x: number; y: number }, items: MenuItem[]) => void
  inspect: (id: string) => void
  toast: (message: string) => void
}

// Shared by the canvas nodes, edges and the mobile list, so they don't need long prop chains.
export const EditorContext = createContext<EditorContextValue | null>(null)

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) throw new Error('useEditor must be used inside FlowEditor')
  return context
}
