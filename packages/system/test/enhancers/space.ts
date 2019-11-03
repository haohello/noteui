import { space } from '../../src/enhancers/'
import { buildEmptyThemeFn, buildStyleParamFn } from '../../src/themes/util'

test('returns style objects', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: '4px',
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: '4px' })
})

test('returns 0 values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: 0,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: 0 })
})

test('returns negative pixel values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: -2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: -8 })
})

test('returns negative em values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: '-16em',
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: '-16em' })
})

test('returns negative theme values', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      space: [0, 4, 8],
    }
  }
  const styleParam = buildStyleParamFn(
    {
      m: -2
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: -8 })
})

test('returns positive theme values', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      space: [0, '1em', '2em'],
    }
  }
  const styleParam = buildStyleParamFn(
    {
      m: 2
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: '2em' })
})

test('returns responsive values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: [0, 2, 3],
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({
    margin: 0,
    '@media screen and (min-width: 40em)': { margin: 8 },
    '@media screen and (min-width: 52em)': { margin: 16 },
  })
})

test('returns aliased values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      px: 2
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ paddingLeft: 8, paddingRight: 8 })
})

test('returns string values from theme', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      space: [0, '1em'],
    }
  }
  const styleParam = buildStyleParamFn(
    {
      padding: 1,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ padding: '1em' })
})

test('returns negative string values from theme', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      space: [0, '1em'],
    }
  }
  const styleParam = buildStyleParamFn(
    {
      margin: -1,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: '-1em' })
})

test('returns values from theme object', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      space: { sm: 1 },
    }
  }
  const styleParam = buildStyleParamFn(
    {
      margin: 'sm',
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: 1 })
})

test('pl prop sets paddingLeft', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      pl: 2
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ paddingLeft: 8 })
})

test('pl prop sets paddingLeft 0', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      pl: 0
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ paddingLeft: 0 })
})

test('px prop overrides pl prop', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      pl: 1,
      px: 2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ paddingLeft: 8, paddingRight: 8 })
})

test('py prop overrides pb prop', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      pb: 1,
      py: 2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ paddingTop: 8, paddingBottom: 8 })
})

test('mx prop overrides mr prop', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      mr: 1,
      mx: 2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ marginLeft: 8, marginRight: 8 })
})

test('my prop overrides mt prop', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      mt: 1,
      my: 2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ marginTop: 8, marginBottom: 8 })
})

test('margin overrides m prop', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: 1,
      margin: 2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({ margin: 8 })
})

test('handles margin with no theme', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      mt: 12,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({
    marginTop: 12,
  })
})

test('handles overriding margin/padding shortcut props', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: 4,
      mx: 3,
      mr: 2,
      p: 4,
      py: 3,
      pt: 2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({
    margin: 32,
    marginLeft: 16,
    marginRight: 8,
    padding: 32,
    paddingBottom: 16,
    paddingTop: 8,
  })
})

test('single directions override axes', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      mx: 3,
      ml: 1,
      mr: 2,
      px: 3,
      pl: 1,
      pr: 2,
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({
    marginLeft: 4,
    marginRight: 8,
    paddingLeft: 4,
    paddingRight: 8,
  })
})

test('supports object values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      m: {
        _: 0,
        0: 1,
        1: 2,
      }
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({
    margin: 0,
    '@media screen and (min-width: 40em)': {
      margin: 4,
    },
    '@media screen and (min-width: 52em)': {
      margin: 8,
    },
  })
})

test('supports non-array breakpoints', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    disableStyledSystemCache: true,
    breakpoints: {
      small: '40em',
      medium: '52em',
    }
  }
  const styleParam = buildStyleParamFn(
    {
      p: {
        small: 2,
      },
      m: {
        _: 0,
        small: 1,
        medium: 2,
      }
    },
    theme, theme.siteVariables)
  const styles = space(styleParam)
  expect(styles).toEqual({
    margin: 0,
    '@media screen and (min-width: 40em)': {
      margin: 4,
      padding: 8,
    },
    '@media screen and (min-width: 52em)': {
      margin: 8,
    },
  })
})