import { useState, type KeyboardEvent } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { nodeSize, orchestratorIcon } from '../catalog'
import { useEditor } from '../EditorContext'
import { nodeMenu } from '../menus'
import NodeCard from '../NodeCard'
import styles from './PromptNode.module.css'

// Double-click to edit the prompt in place. Enter saves, Esc cancels.
const PromptNode = ({ id, selected }: NodeProps) => {
  const editor = useEditor()
  const { state, dispatch, text, search } = editor
  const [draft, setDraft] = useState<string | null>(null)

  const save = () => {
    if (draft !== null) dispatch({ type: 'prompt', value: draft.trim() })
    setDraft(null)
  }

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      save()
    }
    if (event.key === 'Escape') setDraft(null)
  }

  const matches = !search || `${text.prompt} ${state.prompt}`.toLowerCase().includes(search.toLowerCase())

  return (
    <div style={{ width: nodeSize.prompt.width }} onDoubleClick={() => setDraft(state.prompt)}>
      <NodeCard
        icon={orchestratorIcon}
        iconColor="var(--color-accent)"
        title={text.prompt}
        description={draft === null ? state.prompt || text.editPrompt : ''}
        status={state.run.status === 'idle' ? null : 'done'}
        statusLabel={text.status.done}
        selected={selected}
        dimmed={!matches}
        menuLabel={text.options}
        onMenu={(anchor) => editor.openMenu(anchor, nodeMenu(id, editor))}
      >
        {draft !== null && (
          <textarea
            className={`${styles.input} nodrag nowheel`}
            aria-label={text.prompt}
            value={draft}
            rows={3}
            autoFocus
            onChange={(event) => setDraft(event.target.value)}
            onBlur={save}
            onKeyDown={handleKey}
          />
        )}
      </NodeCard>
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  )
}

export default PromptNode
