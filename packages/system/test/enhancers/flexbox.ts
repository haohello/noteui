import flexbox from '../../src/enhancers/flexbox'
import { buildEmptyThemeFn } from '../../src/themes/util'

test('returns flexbox styles', () => {
  const theme = buildEmptyThemeFn()
  const style = flexbox({
    displayName: 'ui-test',
    props: {
      alignItems: 'center',
      flex: '1 1 auto',
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(style).toEqual({
    alignItems: 'center',
    flex: '1 1 auto',
  })
})