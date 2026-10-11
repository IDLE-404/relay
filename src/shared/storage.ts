// localStorage that never throws. If storage is blocked (private mode, disabled cookies),
// values live in memory for this page session instead.
const memory = new Map<string, string>()

const backend = (): Storage | null => {
  try {
    const storage = window.localStorage
    const probe = '__relay_probe__'
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}

export const storage = {
  get(key: string): string | null {
    try {
      return backend()?.getItem(key) ?? memory.get(key) ?? null
    } catch {
      return memory.get(key) ?? null
    }
  },
  set(key: string, value: string) {
    memory.set(key, value)
    try {
      backend()?.setItem(key, value)
    } catch {
      // keep the in-memory copy
    }
  },
  remove(key: string) {
    memory.delete(key)
    try {
      backend()?.removeItem(key)
    } catch {
      // nothing to do
    }
  },
}
