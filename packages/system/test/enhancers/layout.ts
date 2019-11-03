import { layout } from '../../src/enhancers/'
import { buildEmptyThemeFn } from '../../src/themes/util'

test('returns layout styles', () => {
  const theme = buildEmptyThemeFn()
  const style = layout({
    displayName: 'ui-test',
    props: {
      width: [ 1, 1/2, 1/4 ],
      minHeight: 32,
      maxWidth: 768,
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({
    width: '100%',
    maxWidth: 768,
    minHeight: 32,
    '@media screen and (min-width: 40em)': {
      width: '50%',
    },
    '@media screen and (min-width: 52em)': {
      width: '25%',
    },
  })
})

test('returns 0 from theme.sizes', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      sizes: [ 24, 48, 96 ],
    }
  }
  const style = layout({
    displayName: 'ui-test',
    props: {
      width: 0,
      height: 0,
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({
    width: 24,
    height: 24,
  })
})