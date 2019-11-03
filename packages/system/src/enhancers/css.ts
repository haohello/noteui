import * as CSSType from 'csstype'
import { ComponentStyleFunctionParam, ComponentSlotStylesInput, ComponentSlotStylesPrepared, ComponentSlotStyleFunction } from '../themes/types'
import { buildEmptyThemeFn, buildStyleParamFn } from '../themes/util'
import { merge } from './core'

// based on https://github.com/developit/dlv
export const get = (obj, key, def, p, undef) => {
  key = key && key.split ? key.split('.') : [key]
  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef
  }
  return obj === undef ? def : obj
}

const defaultBreakpoints = [40, 52, 64].map(n => n + 'em')

const defaultSiteVariables = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
}

const aliases = {
  bg: 'backgroundColor',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: 'marginX',
  my: 'marginY',
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: 'paddingX',
  py: 'paddingY',
}

const multiples = {
  marginX: ['marginLeft', 'marginRight'],
  marginY: ['marginTop', 'marginBottom'],
  paddingX: ['paddingLeft', 'paddingRight'],
  paddingY: ['paddingTop', 'paddingBottom'],
  size: ['width', 'height'],
}

const scales = {
  color: 'colors',
  backgroundColor: 'colors',
  borderColor: 'colors',
  margin: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginLeft: 'space',
  marginX: 'space',
  marginY: 'space',
  padding: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingLeft: 'space',
  paddingX: 'space',
  paddingY: 'space',
  top: 'space',
  right: 'space',
  bottom: 'space',
  left: 'space',
  gridGap: 'space',
  gridColumnGap: 'space',
  gridRowGap: 'space',
  gap: 'space',
  columnGap: 'space',
  rowGap: 'space',
  fontFamily: 'fonts',
  fontSize: 'fontSizes',
  fontWeight: 'fontWeights',
  lineHeight: 'lineHeights',
  letterSpacing: 'letterSpacings',
  border: 'borders',
  borderTop: 'borders',
  borderRight: 'borders',
  borderBottom: 'borders',
  borderLeft: 'borders',
  borderWidth: 'borderWidths',
  borderStyle: 'borderStyles',
  borderRadius: 'radii',
  borderTopRightRadius: 'radii',
  borderTopLeftRadius: 'radii',
  borderBottomRightRadius: 'radii',
  borderBottomLeftRadius: 'radii',
  borderTopWidth: 'borderWidths',
  borderTopColor: 'colors',
  borderTopStyle: 'borderStyles',
  borderBottomWidth: 'borderWidths',
  borderBottomColor: 'colors',
  borderBottomStyle: 'borderStyles',
  borderLeftWidth: 'borderWidths',
  borderLeftColor: 'colors',
  borderLeftStyle: 'borderStyles',
  borderRightWidth: 'borderWidths',
  borderRightColor: 'colors',
  borderRightStyle: 'borderStyles',
  outlineColor: 'colors',
  boxShadow: 'shadows',
  textShadow: 'shadows',
  zIndex: 'zIndices',
  width: 'sizes',
  minWidth: 'sizes',
  maxWidth: 'sizes',
  height: 'sizes',
  minHeight: 'sizes',
  maxHeight: 'sizes',
  flexBasis: 'sizes',
  size: 'sizes',
  // svg
  fill: 'colors',
  stroke: 'colors',
}

const positiveOrNegative = (scale, value) => {
  if (typeof value !== 'number' || value >= 0) {
    return get(scale, value, value, 0, undefined)
  }
  const absolute = Math.abs(value)
  const n = get(scale, absolute, absolute, 0, undefined)
  if (typeof n === 'string') return '-' + n
  return n * -1
}

const transforms = [
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginX',
  'marginY',
  'top',
  'bottom',
  'left',
  'right',
].reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: positiveOrNegative,
  }),
  {}
)

export const responsive = styles => (styleParam: ComponentStyleFunctionParam) => {
  const next = {}
  const breakpoints = get(styleParam.theme, 'breakpoints', defaultBreakpoints, 0, undefined)
  const mediaQueries = [
    null,
    ...breakpoints.map(n => `@media screen and (min-width: ${n})`),
  ]

  for (const key in styles) {
    const value =
      typeof styles[key] === 'function' ? styles[key](styleParam.variables) : styles[key]

    if (value == null) continue
    if (!Array.isArray(value)) {
      next[key] = value
      continue
    }
    for (let i = 0; i < value.slice(0, mediaQueries.length).length; i++) {
      const media = mediaQueries[i]
      if (value[i] == null) continue
      if (!media) {
        next[key] = value[i]
        continue
      }
      next[media] = next[media] || {}
      next[media][key] = value[i]
    }
  }

  return next
}

export const css = (args): ComponentSlotStyleFunction => (styleParam: ComponentStyleFunctionParam): CSSType.Properties => {
  if (!styleParam) {
    const theme = buildEmptyThemeFn()
    styleParam = buildStyleParamFn({},theme, theme.siteVariables)
  }
  styleParam.variables = merge(defaultSiteVariables, styleParam.variables)
  //const theme = { ...defaultTheme, ...(styleParam.theme || props) }
  let result = {}
  const obj = typeof args === 'function' ? args(styleParam.variables) : args
  const styles = responsive(obj)(styleParam)

  for (const key in styles) {
    const x = styles[key]
    const val = typeof x === 'function' ? x(styleParam.variables) : x

    if (key === 'variant') {
      const variant = css(get(styleParam.variables, val, undefined, 0, undefined))(styleParam)
      result = { ...result, ...variant }
      continue
    }

    if (val && typeof val === 'object') {
      result[key] = css(val)(styleParam)
      continue
    }

    const prop = get(aliases, key, key, 0, undefined)
    const scaleName = get(scales, prop, prop, 0, undefined)
    const scale = get(styleParam.variables, scaleName, get(styleParam.variables, prop, {}, 0, undefined), 0, undefined)
    const transform = get(transforms, prop, get, 0, undefined)
    const value = transform(scale, val, val)

    if (multiples[prop]) {
      const dirs = multiples[prop]
      
      for (let i = 0; i < dirs.length; i++) {
        result[dirs[i]] = value
      }
    } else {
      result[prop] = value
    }
  }

  return result
}

export default css