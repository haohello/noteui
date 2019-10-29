import * as CSS from 'csstype';
import assign from 'object-assign'
import { 
    ObjectOf, 
    StyleFn, 
    ParserProps, 
    ParserConfig, 
    ResponsiveValue, 
    TLengthStyledSystem, 
    ResponsiveArrayValue, 
    ResponsiveObjectValue, 
    ConfigStyle, 
    Config, 
    SxFn,
    ConfigStyleEx,
    TransformFn
} from './types'

export const merge = (a, b) => {
    let result = assign({}, a, b)
    for (const key in a) {
      if (!a[key] || typeof b[key] !== 'object') continue
      assign(result, {
        [key]: assign(a[key], b[key]),
      })
    }
    return result
  }

/* export const merge = <T extends object = object, U extends object = object>(a: T, b: U) => {
    let result = Object.assign(a, b)
    for (const key in a) {
        if (!a[key] || (b.hasOwnProperty(key) && typeof b[(key as unknown) as keyof U] !== 'object')) continue

        Object.assign(result, {
            [key]: Object.assign(a[key], b[(key as unknown) as keyof U])
        })
    }

    return result
} */

/**
 * sort responsive styles
 * @param obj object value responsive styles
 */
const sort = <T extends object = object>(obj: T): ObjectOf<any> => {
    const next = {}
    Object.keys(obj)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .forEach(key => {
            next[key] = obj[key]
        })
    return next
}

const defaults: ObjectOf<any> = {
    breakpoints: [40, 52, 64].map(n => n + 'em')
}

const createMediaQuery = (n: string | number) => `@media screen and (min-width: ${n})`
const getValue = (n, scale, _props) => get(scale, n, n, 0, undefined)

export const get = 
    (obj: ObjectOf<any>, 
     keyPath, 
     defaultVal: any = undefined, 
     p: number = 0, 
     undef = undefined) => {
        let key = keyPath && keyPath.split ? keyPath.split('.') : [keyPath]
        for (p = 0; p < key.length; p++) {
            obj = obj ? obj[key[p]] : undef
        }
        return obj === undef ? defaultVal : obj
}



export const createParser = (config: ParserConfig): StyleFn => {
  const cache: ObjectOf<any> = {}
  const parse: StyleFn = (props: ParserProps): CSS.Properties => {
    let styles: CSS.Properties = {}
    let shouldSort = false
    const isCacheDisabled = props.theme && props.theme.disableStyledSystemCache
  
    for (const key in props) {
      if (!config[key]) continue
      const sx = config[key]
      const raw = props[key]
      const scale = get(props.theme, sx.scale, sx.defaults)
  
      if (typeof raw === 'object') {
        cache.breakpoints =
          (!isCacheDisabled && cache.breakpoints) ||
          get(props.theme, 'breakpoints', defaults.breakpoints)
        if (Array.isArray(raw)) {
          cache.media = (!isCacheDisabled && cache.media) || [
            null,
            ...cache.breakpoints.map(createMediaQuery),
          ]
          styles = merge(
            styles,
            parseResponsiveStyle(cache.media, sx, scale, raw, props)
          )
          continue
        }
        if (raw !== null) {
          styles = merge(
            styles,
            parseResponsiveObject(cache.breakpoints, sx, scale, raw, props)
          )
          shouldSort = true
        }
        continue
      }
  
      assign(styles, sxFunc(sx.properties, sx.transform, raw, scale, props))
    }
  
    // sort object-based responsive styles
    if (shouldSort) {
      styles = sort(styles)
    }
  
    return styles
  }

  parse.config = config
  parse.propNames = Object.keys(config)
  parse.cache = cache

  // const keys = Object.keys(config).filter(k => k !== 'config')
  // if (keys.length > 1) {
  //   keys.forEach(key => {
  //     parse[key] = createParser({ [key]: config[key] })
  //   })
  // }

  return parse
}

const parseResponsiveStyle = (
  mediaQueries: string[], 
  sx: ConfigStyleEx, 
  scale: ResponsiveValue<TLengthStyledSystem>, 
  raw: ResponsiveArrayValue<string | number>, 
  _props: ParserProps): CSS.Properties => {
  let styles: CSS.Properties = {}
  raw.slice(0, mediaQueries.length).forEach((value, i) => {
    const media = mediaQueries[i]
    const style = sxFunc(sx.properties, sx.transform, value, scale, _props)
    if (!media) {
      assign(styles, style)
    } else {
      assign(styles, {
        [media]: assign({}, styles[media], style),
      })
    }
  })
  return styles
}

const parseResponsiveObject = (
  breakpoints, 
  sx: ConfigStyleEx, 
  scale: ResponsiveValue<TLengthStyledSystem>, 
  raw: ResponsiveObjectValue<string | number>, 
  _props: ParserProps): CSS.Properties => {
  let styles: CSS.Properties = {}
  for (let key in raw) {
    const breakpoint = breakpoints[key]
    const value = raw[key]
    const style = sxFunc(sx.properties, sx.transform, value, scale, _props)
    if (!breakpoint) {
      assign(styles, style)
    } else {
      const media = createMediaQuery(breakpoint)
      assign(styles, {
        [media]: assign({}, styles[media], style),
      })
    }
  }
  return styles
}

const sxFunc: SxFn = (
  properties: Array<keyof CSS.Properties>, 
  transform: TransformFn, 
  value: TLengthStyledSystem, 
  scale: ResponsiveValue<TLengthStyledSystem>, 
  _props: ParserProps): CSS.Properties => {
  const result: CSS.Properties = {}
  const n = transform(value, scale, _props)
  if (n === null) return undefined
  properties.forEach(prop => {
    result[prop] = n
  })
  return result
}

export const createStyleFunction = ({
  properties,
  property,
  scale,
  transform = getValue,
  defaultScale,
}: ConfigStyle): ConfigStyleEx => {
  properties = properties || [property]
  return {
    properties,
    scale,
    transform,
    defaults: defaultScale
  }
}

// new v5 API
export const system = (args: Config = {}): StyleFn => {
    const config: ParserConfig = {}
    Object.keys(args).forEach(key => {
        const conf = args[key]
        if (conf === true) {
            // shortcut definition
            config[key] = createStyleFunction({
                property: key as keyof CSS.Properties,
                scale: key,
            })
            return
        }
        // This case isn't covered in the test and there isn't any sample cases shown
        /* if (typeof conf === 'function') {
            config[key] = conf
            return
        } */
        config[key] = createStyleFunction(conf as ConfigStyle)
    })

    const parser = createParser(config)
    return parser
}

export const compose = (...parsers: StyleFn[]): StyleFn => {
    let config: ParserConfig = {}
    parsers.forEach(parser => {
        if (!parser || !parser.config) return
        Object.assign(config, parser.config)
    })
    const parser = createParser(config)

    return parser
}