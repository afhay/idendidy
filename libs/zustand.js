import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useDidStore = create(
  persist(
    (set, get) => ({
      dids: [],
      addADid: (newDid) => set({ dids: [...get().dids, newDid] }),
    }),
    {
      name: 'did-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)