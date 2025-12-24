'use client'
import { createContext, useContext } from 'react'

const MeContext = createContext(null)
export const useMe = () => useContext(MeContext)

export default function MeClient({ me, children }: { me: any; children: React.ReactNode }) {
  return <MeContext.Provider value={me}>{children}</MeContext.Provider>
}
