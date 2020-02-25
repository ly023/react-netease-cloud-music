/**
 * 分页器
 */
import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {scrollIntoView} from 'utils'

import './index.scss'

const MAX_PAGE_COUNT = 9

const getNumbers = (length) => {
    return Array.from(new Array(length), (v, i) => i + 1)
}

const getPages = (current, total) => {
    if (total <= MAX_PAGE_COUNT) {
        return getNumbers(total)
    }
    const half = Math.ceil(MAX_PAGE_COUNT / 2)
    if (current <= half && total - MAX_PAGE_COUNT > 1) {
        return getNumbers(MAX_PAGE_COUNT - 1).concat(['...', total])
    }
    const offset = half - 2
    if (current + half <= total) {
        const centerPages = Array.from(new Array(offset * 2 + 1), (v, i) => current - offset + i)
        return [1, '...', ...centerPages, '...', total]
    }
    return [1, '...', ...Array.from(new Array(offset * 2 + 1), (v, i) => total - (offset * 2 + 1) + i), total]
}

function Pagination(props) {
    const {current, total, onChange, el} = props
    const prevDisabled = current === 1
    const nextDisabled = current === total
    const showPagination = total > 0 && total > 1

    const {navHeight} = useShallowEqualSelector(({base})=>({
        navHeight: base.navHeight
    }))

    const handleChange = useCallback((current) => {
        scrollIntoView(el, navHeight)
        onChange && onChange(current)
    }, [onChange, el])

    return showPagination && <div styleName="pagination">
        <span
            styleName={`page prev${prevDisabled ? ' disabled' : ''}`}
            onClick={() => {
                if (prevDisabled) {
                    return
                }
                handleChange(current - 1)
            }}
        >
                    上一页
        </span>
        {
            getPages(current, total).map((page, index) => {
                if (Number.isNaN(Number(page))) {
                    return <span key={index}> {page} </span>
                }
                return <span key={index} styleName={`page${current === page ? ' active' : ''}`}
                    onClick={() => handleChange(page)}>{page}</span>
            })
        }
        <span styleName={`page next${nextDisabled ? ' disabled' : ''}`}
            onClick={() => {
                if (nextDisabled) {
                    return
                }
                handleChange(current + 1)
            }}>
                    下一页
        </span>
    </div>
}

Pagination.propTypes = {
    current: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
    el: PropTypes.object,
}

Pagination.defaultProps = {
    current: 1,
    total: 0,
    onChange() {}
}

export default React.memo(Pagination)
