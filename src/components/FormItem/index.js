import './index.scss'

const FormItem = (props) => {
    const {error, children, classname} = props

    return <div className={classname} styleName={`field ${error ? "has-error" : ''}`}>
        {children}
    </div>
}

export default FormItem
