import React from 'react'
import './index.scss'

const FormItem = ({classname, error, children}) => {
    return <div className={classname} styleName={`field ${error ? "has-error" : ''}`}>
        {children}
    </div>
}

export default FormItem
