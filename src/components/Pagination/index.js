/**
 * 分页器
 */
import {useCallback, useMemo, memo} from 'react'
import PropTypes from 'prop-types'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import {scrollIntoView} from 'utils'
import {PAGINATION_LIMIT} from 'constants'

import './index.scss'

const MAX_PAGE_COUNT = 9

function getRange(start, length) {
    return Array.from(new Array(length), (v, i) => start + i)
}

function getPages(currentPage, totalPage) {
    if (totalPage <= MAX_PAGE_COUNT) {
        return getRange(1, totalPage)
    }
    const half = Math.ceil(MAX_PAGE_COUNT / 2)
    if (currentPage <= half) {
        return getRange(1, MAX_PAGE_COUNT - 1).concat(['...', totalPage])
    }
    const offset = half - 2
    if (currentPage >= totalPage - offset) {
        const centerPages = Array.from(new Array(MAX_PAGE_COUNT - 1), (v, i) => totalPage - i).reverse()
        return [1, '...', ...centerPages]
    }
    const centerPages = Array.from(new Array(offset * 2 + 1), (v, i) => currentPage - offset + i)
    return [1, '...', ...centerPages, '...', totalPage]
}

function Pagination(props) {
    const {current = 1, total = 0, pageSize = PAGINATION_LIMIT, onChange, el} = props

    const {navHeight} = useShallowEqualSelector(({base}) => ({
        navHeight: base.navHeight
    }))

    const totalPage = useMemo(() => Math.ceil(total / pageSize), [total, pageSize])

    const prevDisabled = current === 1

    const nextDisabled = current === totalPage

    const showPagination = totalPage > 0 && totalPage > 1

    const handleChange = useCallback((current) => {
        scrollIntoView(el, navHeight)
        onChange && onChange(current)
    }, [onChange, el, navHeight])

    const handlePrev = useCallback(() => {
        if (prevDisabled) {
            return
        }
        handleChange(current - 1)
    }, [prevDisabled, handleChange, current])

    const handleNext = useCallback(() => {
        if (nextDisabled) {
            return
        }
        handleChange(current + 1)
    }, [nextDisabled, handleChange, current])

    const renderPages = useMemo(() => {
        const pages = getPages(current, Math.ceil(total / pageSize))
        return pages.map((page, index) => {
            if (Number.isNaN(Number(page))) {
                return <span key={index}> {page} </span>
            }
            return <span
                key={index}
                styleName={`page${current === page ? ' active' : ''}`}
                onClick={() => handleChange(page)}
            >
                {page}
            </span>
        })
    }, [current, total, pageSize, handleChange])

    return showPagination && <div styleName="pagination">
        <span
            styleName={`page prev${prevDisabled ? ' disabled' : ''}`}
            onClick={handlePrev}
        >
            上一页
        </span>
        {renderPages}
        <span
            styleName={`page next${nextDisabled ? ' disabled' : ''}`}
            onClick={handleNext}
        >
            下一页
        </span>
    </div>
}

Pagination.propTypes = {
    current: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    onChange: PropTypes.func,
    el: PropTypes.object,
}

export default memo(Pagination)
