import border from '../../src/enhancers/border'
import { buildEmptyThemeFn } from '../../src/themes/util'

test('returns border styles', () => {
  const theme = buildEmptyThemeFn()
  const style = border({
    displayName: 'ui-test',
    props: {
      border: '1px solid gold'
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({ border: '1px solid gold' })
})

test('returns individual border styles', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      borderWidths: { thin: 1 },
      colors: { primary: 'red' },
      borderStyles: { thick: 'solid' },
      radii: { small: 5 }
    }
  }

  const style = border({
    displayName: 'ui-test',
    props: {
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
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({
    borderTopColor: 'red',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderRightColor: 'red',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderLeftColor: 'red',
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
  })
})

test('returns border top and bottom radii', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      radii: { small: 5 },
    }
  }
  const style = border({
    displayName: 'ui-test',
    props: {
      borderTopLeftRadius: 'small',
      borderTopRightRadius: 'small',
      borderBottomLeftRadius: 'small',
      borderBottomRightRadius: 'small',
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  })
})