import {
  compose,
  space,
  typography,
  color,
  layout,
  flexbox,
  border,
  background,
  position,
  grid,
  shadow,
  buttonStyle,
  textStyle,
  colorStyle
} from '.'
import { ObjectOf, CmpStylePropKeys, CmpStyleProp } from './types'

const all = compose(
  space,
  typography,
  color,
  layout,
  flexbox,
  border,
  background,
  position,
  grid,
  shadow,
  buttonStyle,
  textStyle,
  colorStyle
)

const regex = new RegExp(`^(${all.propNames.join('|')})$`)

export const omit = (props: CmpStyleProp) => {
  const next: CmpStyleProp = {}
  for (let key in props) {
    if (regex.test(key)) continue
    next[key] = props[key]
  }
  return next
}

export const pick = (props: CmpStyleProp) => {
  const next: CmpStyleProp = {}
  for (let key in props) {
    if (!regex.test(key)) continue
    next[key] = props[key]
  }
  return next
}