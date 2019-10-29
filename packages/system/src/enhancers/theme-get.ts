import { get } from './core'
import { Theme, ObjectOf } from './types'

type ThemeGetProps = {
  theme: Theme;
} & ObjectOf<any>

export const themeGet = (path, fallback = null) => (props: ThemeGetProps) =>
  get(props.theme, path, fallback)
export default themeGet