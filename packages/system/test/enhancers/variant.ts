import {
  system,
  compose,
  variant,
  textStyle,
  colorStyle
} from '../../src/enhancers/'
import { buildEmptyThemeFn, buildStyleParamFn } from '../../src/themes/util'
import { ThemePrepared } from '../../src/themes/types'

const defaultSiteVariables = {
  colors: {
    blue: '#07c',
    black: '#111',
  },
}

const fontSize = system({ fontSize: true })
const color = system({ color: true })

test('variant returns style objects from theme', () => {
  const buttons = variant({ key: 'buttons' })

  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      buttons: {
        primary: {
          padding: '32px',
          backgroundColor: 'tomato',
        },
      },
    }
  }
  const styleParam = buildStyleParamFn(
    {
      variant: 'primary',
    },
    theme, theme.siteVariables)
  const a = buttons(styleParam)
  expect(a).toEqual({
    padding: '32px',
    backgroundColor: 'tomato',
  })
})


test('variant prop can be customized', () => {
  const buttons = variant({ key: 'buttons', prop: 'type' })

  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      buttons: {
        primary: {
          padding: '32px',
          backgroundColor: 'tomato',
        },
      },
    }
  }
  const styleParam = buildStyleParamFn(
    {
      type: 'primary',
    },
    theme, theme.siteVariables)


  const a = buttons(styleParam)
  expect(a).toEqual({
    padding: '32px',
    backgroundColor: 'tomato',
  })
})

test('variant can be composed', () => {
  const system = compose(
    variant({ key: 'typography' }),
    fontSize,
    color
  )

  const theme = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      typography: {
        primary: {
          fontSize: '32px',
          color: '#fff',
        },
      },
    }
  }
  const styleParam = buildStyleParamFn(
    {
      variant: 'primary',
      color: '#111',
    },
    theme, theme.siteVariables)


  const result = system(styleParam)
  expect(result).toEqual({
    fontSize: '32px',
    color: '#111',
  })
})

test('textStyle prop returns theme.textStyles object', () => {
  const theme: ThemePrepared = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      textStyles: {
        heading: {
          fontWeight: 'bold',
          lineHeight: 1.25,
        },
      },
    }
  }
  const styleParam = buildStyleParamFn({
      textStyle: 'heading',
    }, theme, theme.siteVariables)
  const a = textStyle(styleParam)
  expect(a).toEqual({
    fontWeight: 'bold',
    lineHeight: 1.25,
  })
})

test('colors prop returns theme.colorStyles object', () => {
  const theme: ThemePrepared = {
    ...buildEmptyThemeFn(),
    siteVariables: {
      colorStyles: {
        dark: {
          color: '#fff',
          backgroundColor: '#000',
        },
      },
    }
  }
  const styleParam = buildStyleParamFn({
      colors: 'dark',
    }, theme, theme.siteVariables)
  const a = colorStyle(styleParam)
  expect(a).toEqual({
    color: '#fff',
    backgroundColor: '#000',
  })
})

describe('component variant', () => {
  test('returns a variant defined inline', () => {
    const comp = variant({
      variants: {
        primary: {
          color: 'black',
          bg: 'tomato',
        },
        secondary: {
          color: 'white',
          bg: 'purple',
        },
      }
    })

    const theme = buildEmptyThemeFn()
    const styleParam1 = buildStyleParamFn(
      {
        variant: 'primary',
      },
      theme, theme.siteVariables)
    const primary = comp(styleParam1)

    const styleParam2 = buildStyleParamFn(
      {
        variant: 'secondary',
      },
      theme, theme.siteVariables)
    const secondary = comp(styleParam2)
    expect(primary).toEqual({
      color: 'black',
      backgroundColor: 'tomato',
    })
    expect(secondary).toEqual({
      color: 'white',
      backgroundColor: 'purple',
    })
  })

  test('returns theme-aware styles', () => {
    const comp = variant({
      variants: {
        primary: {
          p: 3,
          fontSize: 1,
          color: 'white',
          bg: 'primary',
        },
      }
    })

    const theme: ThemePrepared = {
      ...buildEmptyThemeFn(),
      siteVariables: {
        colors: {
          primary: '#07c',
        }
      }
    }
    const styleParam = buildStyleParamFn({
        variant: 'primary',
      }, theme, theme.siteVariables)
    const style = comp(styleParam)
    expect(style).toEqual({
      padding: 16,
      fontSize: 14,
      color: 'white',
      backgroundColor: '#07c',
    })
  })

  test('can use a custom prop name', () => {
    const comp = variant({
      prop: 'size',
      variants: {
        big: {
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1.25,
        },
      }
    })

    const theme: ThemePrepared = buildEmptyThemeFn()
    const styleParam = buildStyleParamFn({
        size: 'big'
      }, theme, theme.siteVariables)
    const style = comp(styleParam)
    expect(style).toEqual({
      fontSize: 32,
      fontWeight: 900,
      lineHeight: 1.25,
    })
  })

  test('does not throw when no variants are found', () => {
    const comp = variant({
      variants: {
        beep: {}
      }
    })
    let style
    const theme: ThemePrepared = buildEmptyThemeFn()
    const styleParam = buildStyleParamFn({
        variant: 'beep'
      }, theme, theme.siteVariables)
    expect(() => {
      style = comp(styleParam)
    }).not.toThrow()
    expect(style).toEqual({})
  })

  test('returns empty object when no prop is provided', () => {
    const comp = variant({
      variants: {
        beep: {}
      }
    })
    // @ts-ignore
    const style = comp({})
    expect(style).toEqual({})
  })

  test('can be composed with other style props', () => {
    const parser = compose(
      variant({
        variants: {
          tomato: {
            color: 'tomato',
            fontSize: 20,
            fontWeight: 'bold',
          }
        }
      }),
      color,
      fontSize
    )

    const theme: ThemePrepared = buildEmptyThemeFn()
    const styleParam1 = buildStyleParamFn({
        variant: 'tomato'
      }, theme, theme.siteVariables)
    const a = parser(styleParam1)

    const styleParam2 = buildStyleParamFn({
      variant: 'tomato',
      color: 'blue',
      fontSize: 32,
    }, theme, theme.siteVariables)
    const b = parser(styleParam2)
    expect(a).toEqual({
      color: 'tomato',
      fontSize: 20,
      fontWeight: 'bold',
    })
    expect(b).toEqual({
      color: 'blue',
      fontSize: 32,
      fontWeight: 'bold',
    })
  })

  test('theme-based variants override local variants', () => {
    const comp = variant({
      variants: {
        primary: {
          color: 'white',
          bg: 'blue',
        }
      },
      scale: 'buttons',
    })

    const theme: ThemePrepared = {
      ...buildEmptyThemeFn(),
      siteVariables: {
        buttons: {
          primary: {
            color: 'black',
            bg: 'cyan',
          }
        }
      }
    }
    const styleParam = buildStyleParamFn({
        variant: 'primary',
      }, theme, theme.siteVariables)

    const style = comp(styleParam)
    expect(style).toEqual({
      color: 'black',
      backgroundColor: 'cyan',
    })
  })
})