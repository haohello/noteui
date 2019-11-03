import background from '../../src/enhancers/background'
import { buildEmptyThemeFn } from '../../src/themes/util'

test('returns background styles', () => {
  const theme = buildEmptyThemeFn()
  const style = background({
    displayName: 'ui-test',
    props: {
      backgroundImage: 'url(kitten.gif)'
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({ backgroundImage: 'url(kitten.gif)' })
})