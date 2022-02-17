import {forwardRef} from 'React'
import {NavLink as BaseNavLink} from 'react-router-dom'

const NavLink = forwardRef(({activeClassName, activeStyle, ...restProps}, ref) => {
        return (
            <BaseNavLink
                ref={ref}
                {...restProps}
                className={({isActive}) =>
                    [
                        restProps.className,
                        isActive ? activeClassName : null
                    ]
                        .filter(Boolean)
                        .join(' ')
                }
                style={({isActive}) => ({
                    ...restProps.style,
                    ...(isActive ? activeStyle : null)
                })}
            />
        )
    }
)

export default NavLink