import 'react'

declare module 'react' {
    interface Attributes {
        styleName?: string
    }
}

declare module '*.jpg'
declare module '*.png'
declare module '*.jpeg'