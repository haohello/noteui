import {
  AccessibilityDefinition,
  // FocusZoneMode,
  // FocusZoneDefinition,
  Accessibility,
} from './accessibility'
import callable from './utils/callable'
import { omit } from './utils/style'
import cx from 'classnames'
import * as React from 'react'
import * as _ from 'lodash'

import logProviderMissingWarning from './utils/providerMissingHandler'
import {
  ComponentStyleFunctionParam,
  ComponentVariablesObject,
  ComponentSlotClasses,
  ComponentSlotStylesPrepared,
  PropsWithVarsAndStyles,
  State,
  ThemePrepared,
} from './themes/types'
import { Props, ProviderContextPrepared } from './types'
import { ReactAccessibilityBehavior, AccessibilityActionHandlers } from './accessibility/reactTypes'
import getKeyDownHandlers from './getKeyDownHandlers'
import { emptyTheme, mergeComponentStyles, mergeComponentVariables } from './themes/mergeThemes'
import createAnimationStyles from './themes/createAnimationStyles'
import { isEnabled as isDebugEnabled } from './utils/debug/debugEnabled'
import { DebugData } from './utils/debug/debugData'
import withDebugId from './utils/withDebugId'

export interface RenderResultConfig<P> {
  ElementType: React.ElementType<P>
  classes: ComponentSlotClasses
  unhandledProps: Props
  variables: ComponentVariablesObject
  styles: ComponentSlotStylesPrepared
  accessibility: ReactAccessibilityBehavior
  rtl: boolean
  theme: ThemePrepared
}

export type RenderComponentCallback<P> = (config: RenderResultConfig<P>) => any

export interface RenderConfig<P> {
  className?: string
  displayName: string
  handledProps: string[]
  props: PropsWithVarsAndStyles
  state: State
  actionHandlers: AccessibilityActionHandlers
  render: RenderComponentCallback<P>
  saveDebug: (debug: DebugData | null) => void
}

const emptyBehavior: ReactAccessibilityBehavior = {
  attributes: {},
  keyHandlers: {},
}

const getAccessibility = (
  displayName: string,
  props: State & PropsWithVarsAndStyles & { accessibility?: Accessibility },
  actionHandlers: AccessibilityActionHandlers,
  isRtlEnabled: boolean,
): ReactAccessibilityBehavior => {
  const { accessibility } = props

  if (_.isNil(accessibility)) {
    return emptyBehavior
  }

  const definition: AccessibilityDefinition = accessibility(props)
  const keyHandlers = getKeyDownHandlers(actionHandlers, definition.keyActions, isRtlEnabled)

  if (process.env.NODE_ENV !== 'production') {
    // For the non-production builds we enable the runtime accessibility attributes validator.
    // We're adding the data-aa-class attribute which is being consumed by the validator, the
    // schema is located in @stardust-ui/ability-attributes package.
    if (definition.attributes) {
      const slotNames = Object.keys(definition.attributes)
      slotNames.forEach(slotName => {
        if (!definition.attributes[slotName]) {
          definition.attributes[slotName] = {}
        }

        definition.attributes[slotName]['data-aa-class'] = `${displayName}${
          slotName === 'root' ? '' : `__${slotName}`
        }`
      })
    }
  }

  return {
    ...emptyBehavior,
    ...definition,
    keyHandlers,
  }
}

const renderComponent = <P extends {}>(
  config: RenderConfig<P>,
  context?: ProviderContextPrepared,
): React.ReactElement<P> => {
  const {
    className,
    displayName,
    handledProps,
    props,
    state,
    actionHandlers,
    render,
    saveDebug = () => {},
  } = config

  if (_.isEmpty(context)) {
    logProviderMissingWarning()
  }

  const {
    disableAnimations = false,
    renderer = null,
    rtl = false,
    theme = emptyTheme,
    _internal_resolvedComponentVariables: resolvedComponentVariables = {},
  } = context || {}

  const ElementType = props.as || 'div' // getElementType(props) as React.ReactType<P>
  const stateAndProps = { ...state, ...props }

  // Resolve variables for this component, cache the result in provider
  if (!resolvedComponentVariables[displayName]) {
    resolvedComponentVariables[displayName] =
      callable(theme.componentVariables[displayName])(theme.siteVariables) || {} // component variables must not be undefined/null (see mergeComponentVariables contract)
  }

  // Merge inline variables on top of cached variables
  const resolvedVariables = props.variables
    ? mergeComponentVariables(
        resolvedComponentVariables[displayName],
        withDebugId(props.variables, 'props.variables'),
      )(theme.siteVariables)
    : resolvedComponentVariables[displayName]

  const animationCSSProp = props.animation
    ? createAnimationStyles(props.animation, context.theme)
    : {}

  // Resolve styles using resolved variables, merge results, allow props.styles to override
  const mergedStyles: ComponentSlotStylesPrepared = mergeComponentStyles(
    theme.componentStyles[displayName],
    withDebugId({ root: props.design }, 'props.design'),
    withDebugId({ root: props.styles }, 'props.styles'),
    withDebugId({ root: animationCSSProp }, 'props.animation'),
  )

  const accessibility: ReactAccessibilityBehavior = getAccessibility(
    displayName,
    stateAndProps,
    actionHandlers,
    rtl,
  )

  const unhandledProps = omit(props, handledProps) // getUnhandledProps(handledProps, props)

  const styleParam: ComponentStyleFunctionParam = {
    displayName,
    props: stateAndProps,
    variables: resolvedVariables,
    theme,
    rtl,
    disableAnimations,
  }

  // Fela plugins rely on `direction` param in `theme` prop instead of RTL
  // Our API should be aligned with it
  // Heads Up! Keep in sync with Design.tsx render logic
  const direction = rtl ? 'rtl' : 'ltr'
  const felaParam = {
    theme: { direction },
    displayName, // does not affect styles, only used by useEnhancedRenderer in docs
  }

  const resolvedStyles: ComponentSlotStylesPrepared = {}
  const resolvedStylesDebug: { [key: string]: { styles: Object }[] } = {}
  const classes: ComponentSlotClasses = {}

  Object.keys(mergedStyles).forEach(slotName => {
    resolvedStyles[slotName] = callable(mergedStyles[slotName])(styleParam)

    if (process.env.NODE_ENV !== 'production' && isDebugEnabled) {
      resolvedStylesDebug[slotName] = resolvedStyles[slotName]['_debug']
      delete resolvedStyles[slotName]['_debug']
    }

    if (renderer) {
      classes[slotName] = renderer.renderRule(callable(resolvedStyles[slotName]), felaParam)
    }
  })

  classes.root = cx(className, classes.root, props.className)

  const resolvedConfig: RenderResultConfig<P> = {
    ElementType,
    unhandledProps,
    classes,
    variables: resolvedVariables,
    styles: resolvedStyles,
    accessibility,
    rtl,
    theme,
  }

  // conditionally add sources for evaluating debug information to component
  if (process.env.NODE_ENV !== 'production' && isDebugEnabled) {
    saveDebug({
      componentName: displayName,
      componentVariables: _.filter(
        resolvedVariables._debug,
        variables => !_.isEmpty(variables.resolved),
      ),
      componentStyles: _.mapValues(resolvedStylesDebug, v =>
        _.filter(v, v => {
          return !_.isEmpty(v.styles)
        }),
      ),
      siteVariables: _.filter(theme.siteVariables._debug, siteVars => {
        if (_.isEmpty(siteVars) || _.isEmpty(siteVars.resolved)) {
          return false
        }

        const keys = Object.keys(siteVars.resolved)
        if (
          keys.length === 1 &&
          keys.pop() === 'fontSizes' &&
          _.isEmpty(siteVars.resolved['fontSizes'])
        ) {
          return false
        }

        return true
      }),
    })
  }

  // if (accessibility.focusZone) {
  //   return renderWithFocusZone(render, accessibility.focusZone, resolvedConfig)
  // }

  return render(resolvedConfig)
}

export default renderComponent