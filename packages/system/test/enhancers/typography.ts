import { typography } from '../../src/enhancers/'
import { buildEmptyThemeFn, buildStyleParamFn } from '../../src/themes/util'

test('returns typography styles', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      fontSize: 32,
      fontWeight: 'bold',
    },
    theme, theme.siteVariables)
  const styles = typography(styleParam)
  expect(styles).toEqual({
    fontSize: 32,
    fontWeight: 'bold',
  })
})