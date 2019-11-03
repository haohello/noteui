import * as CSS from 'csstype'
import * as React from 'react'
import { IRenderer as FelaRenderer } from 'fela'

export type Extendable<T, V = any> = T & {
  [key: string]: V
}
export type ResultOf<T> = T extends (...arg: any[]) => infer TResult ? TResult : never

export type ObjectOf<T> = { [key: string]: T }

export type ObjectOrFunc<TResult, TArg = {}> = ((arg: TArg) => TResult) | TResult

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type ObjectOrArray<T> = T[] | { [K: string]: T | ObjectOrArray<T> }

/**
 * State
 */
export type State = ObjectOf<any>

/**
 * Variables
 */
export interface SiteVariablesInput extends ObjectOf<any> {}

export interface SiteVariablesPrepared extends SiteVariablesInput {
  mediaQueries?: { [size: string]: string }
  space?: ObjectOrArray<number | string>
  fontSizes?: ObjectOrArray<CSS.FontSizeProperty<number>>
  colors?: ObjectOrArray<CSS.ColorProperty>
  fonts?: ObjectOrArray<CSS.FontFamilyProperty>
  fontWeights?: ObjectOrArray<CSS.FontWeightProperty>
  lineHeights?: ObjectOrArray<CSS.LineHeightProperty<{}>>
  letterSpacings?: ObjectOrArray<CSS.LetterSpacingProperty<{}>>
  sizes?: ObjectOrArray<CSS.HeightProperty<{}> | CSS.WidthProperty<{}>>
  borders?: ObjectOrArray<CSS.BorderProperty<{}>>
  borderStyles?: ObjectOrArray<CSS.BorderProperty<{}>>
  borderWidths?: ObjectOrArray<CSS.BorderWidthProperty<{}>>
  radii?: ObjectOrArray<CSS.BorderRadiusProperty<{}>>
  shadows?: ObjectOrArray<CSS.BoxShadowProperty>
  zIndices?: ObjectOrArray<CSS.ZIndexProperty>
  // buttons?: ObjectOrArray<CSS.StandardProperties>
  colorStyles?: ObjectOrArray<CSS.StandardProperties>
  textStyles?: ObjectOrArray<CSS.StandardProperties>
  disableStyledSystemCache?: boolean
}

export type ComponentVariablesObject = any

export type ComponentVariablesPrepared = (
  siteVariables?: SiteVariablesPrepared,
  props?: any
) => ComponentVariablesObject

export type ComponentVariablesInput = ComponentVariablesObject | ComponentVariablesPrepared

export interface ComponentStyleFunctionParam<
  TProps extends PropsWithVarsAndStyles = PropsWithVarsAndStyles,
  TVars extends ComponentVariablesObject = ComponentVariablesObject
> {
  displayName: string
  props: State & TProps
  variables: TVars
  theme: ThemePrepared
  rtl: boolean
  disableAnimations: boolean
}

export type ComponentSlotStyleFunction<TProps = {}, TVars = {}> = (
  styleParam?: ComponentStyleFunctionParam<TProps, TVars>,
) => CSS.Properties

export type ComponentSlotStyle<TProps = {}, TVars = {}> =
  | ComponentSlotStyleFunction<TProps, TVars>
  | CSS.Properties

export interface ComponentSlotStylesInput<TProps = {}, TVars = {}>
  extends ObjectOf<ComponentSlotStyle<TProps, TVars>> {}

export interface ComponentSlotStylesPrepared<TProps = {}, TVars = {}>
  extends ObjectOf<ComponentSlotStyleFunction<TProps, TVars>> {}

export interface ComponentSlotClasses extends ObjectOf<string> {}




// ========================================================
// Fonts
// ========================================================

export interface FontFaceProps {
  fontStretch?: string
  fontStyle?: string
  fontVariant?: string
  fontWeight?: number
  localAlias?: string | string[]
  unicodeRange?: string
}

export interface FontFace {
  name: string
  paths: string[]
  props: FontFaceProps
}

export type FontFaces = FontFace[]

// ========================================================
// Icons
// ========================================================

type SvgIconFuncArg = {
  classes: { [iconSlot: string]: string }
  rtl: boolean
  props: ObjectOf<any> // TODO: modify later when Icon component is implemented
}

export type SvgIconSpec = ObjectOrFunc<React.ReactNode, SvgIconFuncArg>
export type FontIconSpec = {
  content: string
  fontFamily: string
}

export type ThemeIconSpec = {
  isSvg?: boolean
  icon: FontIconSpec | SvgIconSpec
}

export type RequiredIconNames =
  | 'stardust-checkmark'
  | 'stardust-circle'
  | 'stardust-close'
  | 'stardust-arrow-end'
  | 'stardust-arrow-up'
  | 'stardust-arrow-down'
  | 'stardust-pause'
  | 'stardust-play'

export type ThemeIcons = Partial<Record<RequiredIconNames, ThemeIconSpec>> & {
  [iconName: string]: ThemeIconSpec
}

// ========================================================
// Static Styles
// ========================================================

export type StaticStyleObject = ObjectOf<keyof CSS.Properties>

export type StaticStyleRenderable = string | StaticStyleObject

export type StaticStyleFunction = (siteVariables?: SiteVariablesPrepared) => StaticStyleObject

export type StaticStyle = StaticStyleRenderable | StaticStyleFunction

export type StaticStyles = StaticStyle[]

export interface ThemeAnimation<KP = {}> {
  keyframe: ((kp: KP) => object) | object | string
  delay?: string
  direction?: string
  duration?: string
  fillMode?: string
  iterationCount?: string
  playState?: string
  timingFunction?: string
  keyframeParams?: KP
}

export type AnimationProp =
  | {
      name: string
      delay?: string
      direction?: string
      duration?: string
      fillMode?: string
      iterationCount?: string
      playState?: string
      timingFunction?: string
      keyframeParams?: object
    }
  | string

/**
 * Theme
 */
export interface ThemeInput {
  siteVariables?: SiteVariablesInput
  componentVariables?: ComponentVariablesInput
  componentStyles?: ThemeComponentStylesInput
  breakpoints?: string[] | number[] | object
  fontFaces?: FontFaces
  staticStyles?: StaticStyles
  icons?: ThemeIcons
  animations?: { [key: string]: ThemeAnimation }
}

// Component variables and styles must be resolved by the component after
// all cascading is complete, not by any Provider in the middle of the tree.
// This ensures the final site variables are used in the component's variables
// and styles. Resolving component variables/styles in the Provider would mean
// the latest site variables might not be applied to the component.
//
// As a theme cascades down the tree and is merged with the previous theme on
// context, the resulting theme takes this shape.
export interface ThemePrepared {
  siteVariables: SiteVariablesPrepared
  componentVariables: { [key in keyof ThemeComponentVariablesPrepared]: ComponentVariablesPrepared }
  componentStyles: { [key in keyof ThemeComponentStylesPrepared]: ComponentSlotStylesPrepared }
  breakpoints: string[] | number[] | object
  icons: ThemeIcons
  fontFaces: FontFaces
  staticStyles: StaticStyles
  animations: { [key: string]: ThemeAnimation }
  disableStyledSystemCache: boolean
}

export type ThemeComponentVariablesInput = {
  [K:string]: ComponentVariablesInput
} &
  Record<string, any>

export type ThemeComponentVariablesPrepared = {
  [K: string]: ComponentVariablesPrepared
} &
  Record<string, any>

export type ThemeComponentStylesInput = {
  [K: string]: ComponentSlotStylesInput<any, any>
} &
  Record<string, ComponentSlotStylesInput | undefined>

export type ThemeComponentStylesPrepared = {
  [K: string]: ComponentSlotStylesPrepared<any, any>
} &
  Record<string, ComponentSlotStylesPrepared | undefined>

// ========================================================
// Props
// ========================================================

export type PropsWithVarsAndStyles = Extendable<{
  variables?: ComponentVariablesInput
  styles?: object
}>


export interface Renderer extends FelaRenderer {}