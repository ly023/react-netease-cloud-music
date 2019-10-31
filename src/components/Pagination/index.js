/**
 * 分页器
 */
import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const MAX_PAGE_COUNT = 9

export default class Pagination extends React.PureComponent {
    static propTypes = {
        current: PropTypes.number,
        total: PropTypes.number,
    }

    static defaultProps = {
        current: 1,
        total: 0
    }

    getNumbers = (length) => {
        return Array.from(new Array(length), (v, i) => i + 1)
    }

    getPages = () => {
        const {current, total} = this.props

        if (total <= MAX_PAGE_COUNT) {
            return this.getNumbers(MAX_PAGE_COUNT)
        }
        const half = Math.ceil(MAX_PAGE_COUNT / 2)
        if (current <= half && total - MAX_PAGE_COUNT > 1) {
            return this.getNumbers(MAX_PAGE_COUNT - 1).concat(['...', total])
        }
        const offset = half - 2
        if (current + half <= total) {
            const centerPages = Array.from(new Array(offset * 2 + 1), (v, i) => current - offset + i)
            return [1, '...', ...centerPages, '...', total]
        }
        return [1, '...', ...Array.from(new Array(offset * 2 + 1), (v, i) => total - (offset * 2 + 1) + i), total]
    }

    onChange = (current) => {
        const {onChange} = this.props
        onChange && onChange(current)
    }

    render() {
        const {current, total} = this.props
        const prevDisabled = current === 1
        const nextDisabled = current === total

        return (
            total > 0 ? <div styleName="pagination">
                <span
                    styleName={`page prev${prevDisabled ? ' disabled' : ''}`}
                    onClick={() => {
                        if(prevDisabled) {
                            return
                        }
                        this.onChange(current - 1)
                    }}
                >
                    上一页
                </span>
                {
                    this.getPages().map((page, index) => {
                        if (Number.isNaN(Number(page))) {
                            return <span key={index}> {page} </span>
                        }
                        return <span styleName={`page${current === page ? ' active' : ''}`} key={index} onClick={() => this.onChange(page)}>{page}</span>
                    })
                }
                <span
                    styleName={`page next${nextDisabled ? ' disabled' : ''}`}
                    onClick={() => {
                        if(nextDisabled) {
                            return
                        }
                        this.onChange(current + 1)
                    }}>
                    下一页
                </span>
            </div> : null
        )
    }
}
