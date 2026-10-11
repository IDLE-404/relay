import {
  SiDiscord,
  SiFigma,
  SiGithub,
  SiGmail,
  SiGoogledrive,
  SiGooglesheets,
  SiNotion,
  SiPostgresql,
  SiTelegram,
} from 'react-icons/si'
import type { Flow } from '@/shared/types'

// Scenario shown in the hero window. Canvas content is a mock UI, kept in English.
export const heroFlow: Flow = {
  title: 'Relay / Weekly report flow',
  prompt: 'Send weekly sales report to Telegram',
  done: '✓ report delivered',
  rows: [
    {
      agent: 'Docs agent',
      tiles: [
        { id: 'drive', server: 'Drive', icon: SiGoogledrive, color: '#1fa463', tools: ['drive.create_doc', 'drive.search', 'drive.share'] },
        { id: 'notion', server: 'Notion', icon: SiNotion, color: 'var(--text)', tools: ['notion.query_db', 'notion.create_page'] },
        { id: 'figma', server: 'Figma', icon: SiFigma, color: '#f24e1e', tools: ['figma.get_file', 'figma.export_frame'] },
      ],
    },
    {
      agent: 'Data agent',
      tiles: [
        { id: 'postgres', server: 'Postgres', icon: SiPostgresql, color: '#4169e1', tools: ['postgres.query', 'postgres.list_tables', 'postgres.describe'] },
        { id: 'sheets', server: 'Sheets', icon: SiGooglesheets, color: '#34a853', tools: ['sheets.read_range', 'sheets.append_row'] },
        { id: 'github', server: 'GitHub', icon: SiGithub, color: 'var(--text)', tools: ['github.search_issues', 'github.create_pr'] },
      ],
    },
    {
      agent: 'Telegram agent',
      tiles: [
        { id: 'telegram', server: 'Telegram', icon: SiTelegram, color: '#26a5e4', tools: ['telegram.send_message', 'telegram.send_file'] },
        { id: 'gmail', server: 'Gmail', icon: SiGmail, color: '#ea4335', tools: ['gmail.send', 'gmail.search'] },
        { id: 'discord', server: 'Discord', icon: SiDiscord, color: '#5865f2', tools: ['discord.post_message'] },
      ],
    },
  ],
  steps: [
    { tileId: 'postgres', call: 'tools/call postgres.query', ms: 84 },
    { tileId: 'drive', call: 'tools/call drive.create_doc', ms: 212 },
    { tileId: 'telegram', call: 'tools/call telegram.send_message', ms: 142 },
  ],
}
