import { position } from '../../src/enhancers/'
import { buildEmptyThemeFn, buildStyleParamFn } from '../../src/themes/util'

test('returns position styles', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    theme, theme.siteVariables)
  const style = position(styleParam)
  expect(style).toEqual({
    position: 'absolute',
    top: 0,
    right: 0,
  })
})

test('returns theme values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      top: 1, right: 2, bottom: 3, left: 4
    },
    theme, theme.siteVariables)
  const style = position(styleParam)
  expect(style).toEqual({ top: 4, right: 8, bottom: 16, left: 32 })
})

test('returns pixel values', () => {
  const theme = buildEmptyThemeFn()
  const styleParam = buildStyleParamFn(
    {
      top: '1px',
      right: '2px',
      bottom: '3px',
      left: '4px',
    },
    theme, theme.siteVariables)
  const style = position(styleParam)
  expect(style).toEqual({
    top: '1px',
    right: '2px',
    bottom: '3px',
    left: '4px',
  })
})