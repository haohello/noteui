import { system } from './core'
// import { Config } from './types'

export const shadow = system({
  boxShadow: {
    property: 'boxShadow',
    scale: 'shadows',
  },
  textShadow: {
    property: 'textShadow',
    scale: 'shadows',
  },
})

export default shadow