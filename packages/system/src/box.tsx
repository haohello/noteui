import * as React from 'react'
import childrenExist from './utils/childrenExist'
import { createShorthandFactory } from './factories'
import { 
  UIComponentProps,
  ContentComponentProps,
  ChildrenComponentProps
} from './commonPropInterfaces'

import * as commonPropTypes from './commonPropTypes'
import rtlTextContainer from './rtlTextContainer'
import createComponent from './createComponent'
import { WithAsProp, withSafeTypeForAs } from './types'

export interface BoxProps
  extends UIComponentProps<BoxProps>,
    ContentComponentProps,
    ChildrenComponentProps {}

const Box = createComponent<WithAsProp<BoxProps>>({
  displayName: 'Box',

  className: 'ui-box',

  propTypes: {
    ...commonPropTypes.createCommon(),
  },

  render(config, props) {
    const { ElementType, classes, unhandledProps } = config
    const { children, content } = props

    return (
      <ElementType
        {...rtlTextContainer.getAttributes({ forElements: [children, content] })}
        {...unhandledProps}
        className={classes.root}
      >
        {childrenExist(children) ? children : content}
      </ElementType>
    )
  },
})

Box.create = createShorthandFactory({ Component: Box })

/**
 * A Box is a basic component, commonly used for slots in other Stardust components.
 * By default it just renders a `div`.
 */
export default withSafeTypeForAs<typeof Box, BoxProps>(Box)