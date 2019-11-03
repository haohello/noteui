import { system, compose } from '../../../src/enhancers/core'
import { ThemePrepared } from '../../../src/themes/types'
import { buildEmptyThemeFn } from '../../../src/themes/util'

const color = system({
  color: true,
  bg: {
    property: 'backgroundColor',
  },
})

const fontSize = system({
  fontSize: true,
})

test('compose combines style parsers', () => {
  const parser = compose(
    color,
    fontSize
  )

  const theme: ThemePrepared = buildEmptyThemeFn()

  const styles = parser({
    displayName: 'ui-test',
    props: {
      color: 'tomato',
      bg: 'black',
      fontSize: 32,
    },
    variables: theme.siteVariables,
    theme,
    rtl: false,
    disableAnimations: true,
  })
  expect(typeof parser).toBe('function')
  expect(styles).toEqual({
    fontSize: 32,
    color: 'tomato',
    backgroundColor: 'black',
  })
})