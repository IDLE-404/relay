export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

// Fills {name} placeholders in an i18n string: fill('{n} calls', { n: 3 }) → '3 calls'.
export const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))
