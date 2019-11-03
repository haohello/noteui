import color from '../../src/enhancers/color'
import { buildEmptyThemeFn } from '../../src/themes/util'

test('returns colors styles', () => {
  const theme = buildEmptyThemeFn()
  const style = color({
    displayName: 'ui-test',
    props: {
      color: 'gold',
      bg: 'tomato',
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({
    color: 'gold',
    backgroundColor: 'tomato',
  })
})