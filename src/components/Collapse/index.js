import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import './index.scss'

function Collapse(props) {
    const {fold, content, onChange, maxWordNumber} = props
    const [isFolding, setFolding] = useState(fold)
    const [showFold, setShowFold] = useState(false)
    const [cont, setCont] = useState(content)

    const ctrlFold = () => {
        const nextFoldedStatus = !isFolding
        setFolding(nextFoldedStatus)
        onChange(nextFoldedStatus)
    }

    const getEllipsisContent = (content, maxWordNumber, isFolding) => {
        if (isFolding && typeof content === 'string') {
            const words = Object.values(content)
            let lastIndex = words.length - 1
            if (lastIndex < maxWordNumber) {
                setShowFold(false)
                return content
            }
            setShowFold(true)
            return `${content.substring(0, maxWordNumber)}...`
        }
        return content
    }

    useEffect(() => {
        setCont(getEllipsisContent(content, maxWordNumber, isFolding))
    }, [content, maxWordNumber, isFolding])

    return <>
        {cont}
        {
            showFold ?
                <div href={null} styleName={`fold-ctrl ellipsis ${isFolding ? 'fold' : 'unfold'}`} onClick={ctrlFold}>
                    {isFolding ? '展开' : '收起'}<i/>
                </div> : null
        }
    </>
}

Collapse.propTypes = {
    fold: PropTypes.bool,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    onChange: PropTypes.func,
    maxWordNumber: PropTypes.number,
}

Collapse.defaultProps = {
    fold: true,
    content: '',
    onChange() {
    },
    maxWordNumber: 100
}

export default Collapse
