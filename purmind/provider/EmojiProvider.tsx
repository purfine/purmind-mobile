import { PropsWithChildren} from 'react'

import DataContext from '../context/DataContext' 

type EmojiProviderProps = PropsWithChildren<{
  data: Record<string, string>
}>

function EmojiProvider({ data, children }: EmojiProviderProps) {
  if (!data) {
    throw new Error('Por favor passe o valor de \'data\' para EmojiProvider')
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  )
}

export default EmojiProvider