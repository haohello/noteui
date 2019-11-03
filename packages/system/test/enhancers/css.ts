import { css } from '../../src/enhancers/'
import { buildEmptyThemeFn, buildStyleParamFn } from '../../src/themes/util'
import { ThemePrepared } from '../../src/themes/types'

const theme: ThemePrepared = {
  ...buildEmptyThemeFn(),
  siteVariables: {
    colors: {
      primary: 'tomato',
      secondary: 'cyan',
    },
    fontSizes: [12, 14, 16, 24, 36],
    fonts: {
      monospace: 'Menlo, monospace',
    },
    lineHeights: {
      body: 1.5,
    },
    fontWeights: {
      bold: 600,
    },
    sizes: {
      small: 4,
      medium: 8,
      large: 16,
      sidebar: 320,
    },
    buttons: {
      primary: {
        p: 3,
        fontWeight: 'bold',
        color: 'white',
        bg: 'primary',
        borderRadius: 2,
      },
    },
    text: {
      caps: {
        fontSize: [1, 2],
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
      title: {
        fontSize: [3, 4],
        letterSpacing: ['-0.01em', '-0.02em'],
      },
    },
    borderWidths: {
      thin: 1,
    },
    borderStyles: {
      thick: 'solid',
    },
    radii: {
      small: 5,
    },
  }
}

test('returns a function', () => {
  // @ts-ignore
  const result = css()
  expect(typeof result).toBe('function')
})

test('returns an object', () => {
  // @ts-ignore
  const result = css()()
  expect(typeof result).toBe('object')
})

test('returns styles', () => {
  // @ts-ignore
  const result = css({
    fontSize: 32,
    color: 'blue',
    borderRadius: 4,
  })()
  expect(result).toEqual({
    fontSize: 32,
    color: 'blue',
    borderRadius: 4,
  })
})

test('returns system props styles', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    color: 'primary',
    fontSize: [2, 3, 4],
  })(styleParam)
  expect(result).toEqual({
    fontSize: 16,
    '@media screen and (min-width: 40em)': {
      fontSize: 24,
    },
    '@media screen and (min-width: 52em)': {
      fontSize: 36,
    },
    color: 'tomato',
  })
})

test('returns nested system props styles', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    color: 'primary',
    '&:hover': {
      color: 'secondary',
    },
  })(styleParam)
  expect(result).toEqual({
    color: 'tomato',
    '&:hover': {
      color: 'cyan',
    },
  })
})

test('returns nested responsive styles', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    color: 'primary',
    h1: {
      py: [3, 4],
    },
  })(styleParam)
  expect(result).toEqual({
    color: 'tomato',
    h1: {
      paddingTop: 16,
      paddingBottom: 16,
      '@media screen and (min-width: 40em)': {
        paddingTop: 32,
        paddingBottom: 32,
      },
    },
  })
})

test('handles all core styled system props', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    m: 0,
    mb: 2,
    mx: 'auto',
    p: 3,
    py: 4,
    fontSize: 3,
    fontWeight: 'bold',
    color: 'primary',
    bg: 'secondary',
    fontFamily: 'monospace',
    lineHeight: 'body',
  })(styleParam)
  expect(result).toEqual({
    margin: 0,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 16,
    paddingTop: 32,
    paddingBottom: 32,
    color: 'tomato',
    backgroundColor: 'cyan',
    fontFamily: 'Menlo, monospace',
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.5,
  })
})

test('works with the css prop', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    color: 'primary',
    m: 0,
    fontSize: 2,
  })(styleParam)
  expect(result).toEqual({
    color: 'tomato',
    margin: 0,
    fontSize: 16,
  })
})

test('works with functional arguments', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css(t => ({
    color: t.colors.primary,
  }))(styleParam)
  expect(result).toEqual({
    color: 'tomato',
  })
})

test('supports functional values', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    color: t => t.colors.primary,
  })(styleParam)
  expect(result).toEqual({
    color: 'tomato',
  })
})

test('returns variants from theme', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    variant: 'buttons.primary',
  })(styleParam)
  expect(result).toEqual({
    padding: 16,
    fontWeight: 600,
    color: 'white',
    backgroundColor: 'tomato',
    borderRadius: 2,
  })
})

test('handles variants with responsive values', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    variant: 'text.caps',
  })(styleParam)
  expect(result).toEqual({
    fontSize: 14,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    '@media screen and (min-width: 40em)': {
      fontSize: 16,
    },
  })
})

test('handles responsive variants', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    variant: 'text.title',
  })(styleParam)
  expect(result).toEqual({
    fontSize: 24,
    letterSpacing: '-0.01em',
    '@media screen and (min-width: 40em)': {
      fontSize: 36,
      letterSpacing: '-0.02em',
    },
  })
})

test('handles negative margins from scale', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    mt: -3,
    mx: -4,
  })(styleParam)
  expect(result).toEqual({
    marginTop: -16,
    marginLeft: -32,
    marginRight: -32,
  })
})

test('handles negative top, left, bottom, and right from scale', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    top: -1,
    right: -4,
    bottom: -3,
    left: -2,
  })(styleParam)
  expect(result).toEqual({
    top: -4,
    right: -32,
    bottom: -16,
    left: -8,
  })
})

test('skip breakpoints', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    width: [ '100%', , '50%' ],
  })(styleParam)
  expect(result).toEqual({
    width: '100%',
    '@media screen and (min-width: 52em)': {
      width: '50%',
    }
  })
})

test('padding shorthand does not collide with nested p selector', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    p: {
      fontSize: 32,
      color: 'tomato',
      p: 2,
    },
    padding: 32,
  })(styleParam)
  expect(result).toEqual({
    p: {
      fontSize: 32,
      color: 'tomato',
      padding: 8,
    },
    padding: 32,
  })
})

test('ignores array values longer than breakpoints', () => {
  const themeK = buildEmptyThemeFn()
  themeK.breakpoints = [ '32em', '40em' ]
  const styleParam = buildStyleParamFn( {}, themeK, themeK.siteVariables)
  const result = css({
    width: [ 32, 64, 128, 256, 512 ]
  })(styleParam)
  expect(result).toEqual({
    width: 32,
    '@media screen and (min-width: 32em)': {
      width: 64,
    },
    '@media screen and (min-width: 40em)': {
      width: 128,
    },
  })
})

test('functional values can return responsive arrays', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    color: t => [t.colors.primary, t.colors.secondary],
  })(styleParam)
  expect(result).toEqual({
    '@media screen and (min-width: 40em)': {
      color: 'cyan',
    },
    color: 'tomato',
  })
})

test('returns individual border styles', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    borderTopWidth: 'thin',
    borderTopColor: 'primary',
    borderTopStyle: 'thick',
    borderTopLeftRadius: 'small',
    borderTopRightRadius: 'small',
    borderBottomWidth: 'thin',
    borderBottomColor: 'primary',
    borderBottomStyle: 'thick',
    borderBottomLeftRadius: 'small',
    borderBottomRightRadius: 'small',
    borderRightWidth: 'thin',
    borderRightColor: 'primary',
    borderRightStyle: 'thick',
    borderLeftWidth: 'thin',
    borderLeftColor: 'primary',
    borderLeftStyle: 'thick',
  })(styleParam)
  expect(result).toEqual({
    borderTopColor: 'tomato',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomColor: 'tomato',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderRightColor: 'tomato',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderLeftColor: 'tomato',
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
  })
})

test('flexBasis uses theme.sizes', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const style = css({
    flexBasis: 'sidebar',
  })(styleParam)
  expect(style).toEqual({
    flexBasis: 320,
  })
})

test('fill and stroke use theme.colors', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const style = css({
    fill: 'primary',
    stroke: 'secondary',
  })(styleParam)
  expect(style).toEqual({
    fill: 'tomato',
    stroke: 'cyan',
  })
})

test('multiples are transformed', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const style = css({
    marginX: 2,
    marginY: 2,
    paddingX: 2,
    paddingY: 2,
    size: 'large',
  })(styleParam)
  expect(style).toEqual({
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    width: 16,
    height: 16,
  })
})

test('returns outline color from theme', () => {
  const styleParam = buildStyleParamFn( {}, theme, theme.siteVariables)
  const result = css({
    outlineColor: 'primary',
  })(styleParam)
  expect(result).toEqual({
    outlineColor: 'tomato'
  })
})