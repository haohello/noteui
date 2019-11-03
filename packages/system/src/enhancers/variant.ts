import { get, createParser, createStyleFunction } from './core'
import * as CSSType from 'csstype'
import css from './css'
import { VariantArgs, StyleFn } from './types'
import { ComponentStyleFunctionParam } from '../themes/types'

export const variant = ({
  scale,
  prop = 'variant',
  // enables new api
  variants = {},
  // shim for v4 API
  key,
}: VariantArgs): StyleFn => {
  let sx
  if (Object.keys(variants).length) {
    sx = (value, scale, styleParam: ComponentStyleFunctionParam) => css(get(scale, value, null))(styleParam)
  } else {
    sx = (value, scale) => get(scale, value, null)
  }
  // sx.properties = [scale || key]
  // sx.scale = scale || key
  // sx.defaults = variants
  const config = {
    [prop]: createStyleFunction({
      property: (scale || key)  as keyof CSSType.Properties,
      isVariant: true,
      scale: scale || key,
      transform: sx,
      defaultScale: variants
    }),
  }
  const parser = createParser(config)
  return parser
}

export default variant

export const buttonStyle = variant({ key: 'buttons' })
export const textStyle = variant({ key: 'textStyles', prop: 'textStyle' })
export const colorStyle = variant({ key: 'colorStyles', prop: 'colors' })