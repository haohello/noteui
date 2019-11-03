import { grid } from '../../src/enhancers/'
import { buildEmptyThemeFn } from '../../src/themes/util'

test('returns grid styles', () => {
  const theme = buildEmptyThemeFn()
  const style = grid({
    displayName: 'ui-test',
    props: {
      gridGap: 32,
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({
    gridGap: 32,
  })
})