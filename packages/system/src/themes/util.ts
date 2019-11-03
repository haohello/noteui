import { ThemePrepared, ComponentStyleFunctionParam, SiteVariablesPrepared } from './types'

export const buildEmptyThemeFn = (): ThemePrepared => ({
  siteVariables: {
  },
  componentVariables: {},
  componentStyles: {},
  breakpoints: undefined,
  fontFaces: [],
  staticStyles: [],
  icons: {},
  animations: {},
  disableStyledSystemCache: false
})

export const buildStyleParamFn = (
  props = {},
  theme: ThemePrepared,
  variables: SiteVariablesPrepared = {},
  displayName: string = 'ui-test',
  rtl: boolean = false,
  disableAnimations: boolean = true
): ComponentStyleFunctionParam => ({
  displayName,
  props,
  variables,
  theme,
  rtl,
  disableAnimations,
})