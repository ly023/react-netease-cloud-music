import { forwardRef } from 'react'
import { NavLink as BaseNavLink } from 'react-router-dom'

// eslint-disable-next-line react/display-name
const NavLink = forwardRef(
  ({ activeClassName, activeStyle, className, style, ...restProps }, ref) => {
    return (
      <BaseNavLink
        ref={ref}
        {...restProps}
        className={({ isActive }) =>
          [className, isActive ? activeClassName : null]
            .filter(Boolean)
            .join(' ')
        }
        style={({ isActive }) => ({
          ...style,
          ...(isActive ? activeStyle : null)
        })}
      />
    )
  }
)

export default NavLink
