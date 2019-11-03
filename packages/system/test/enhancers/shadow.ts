import { shadow } from '../../src/enhancers/'
import { buildEmptyThemeFn, buildStyleParamFn } from '../../src/themes/util'

test('returns shadow styles', () => {
  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      shadows: {
        small: '0 1px 4px rgba(0, 0, 0, .125)',
      },
    }
  }
  const styleParam = buildStyleParamFn(
    {
      textShadow: '0 -1px rgba(255, 255, 255, .25)',
      boxShadow: 'small',
    },
    theme, theme.siteVariables)
  const style = shadow(styleParam)
  expect(style).toEqual({
    textShadow: '0 -1px rgba(255, 255, 255, .25)',
    boxShadow: '0 1px 4px rgba(0, 0, 0, .125)',
  })
})