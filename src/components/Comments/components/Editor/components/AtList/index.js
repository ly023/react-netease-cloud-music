import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import KEY_CODE from 'constants/keyCode'
import {click} from 'utils'

import './index.scss'

const DOM_ID = 'comment-at-list'
const SELECT_TIP = '选择最近@的人或直接输入'
const COMPLETE_TIP = '轻敲空格完成输入'

@connect(({user}) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo
}))
export default class AtList extends React.PureComponent {

    static propTypes = {
        visible: PropTypes.bool,
        list: PropTypes.array,
        value: PropTypes.string,
        style: PropTypes.object,
        onChange: PropTypes.func,
        onCancel: PropTypes.func,
    }

    static defaultProps = {
        visible: false,
        atList: [],
        value: '',
        style: {}
    }

    constructor(props) {
        super(props)
        this.state = {
            atList: [],
            filterList: [],
            activeIndex: 0,
            tip: SELECT_TIP,
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick)
    }

    componentDidUpdate(prevProps) {
        const {visible, value} = this.props
        if (visible && !prevProps.visible) {
            this.setState(this.getState())
            document.addEventListener('keydown', this.keyDownListener)
        } else if (!visible && prevProps.visible) {
            this.setState(this.getState())
            document.removeEventListener('keydown', this.keyDownListener)
        }
        if (value !== prevProps.value) {
            this.setState(this.getState())
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick)
        document.removeEventListener('keydown', this.keyDownListener)
    }

    getState = () => {
        const filterList = this.getFilterList()
        if (filterList.length) {
            return {
                ...this.state,
                filterList: filterList,
                activeIndex: 0,
                tip: SELECT_TIP,
            }
        }
        return {
            ...this.state,
            filterList: [],
            activeIndex: 0,
            tip: COMPLETE_TIP,
        }
    }

    handleDocumentClick = (e) => {
        click(e, DOM_ID, this.props.onCancel)
    }

    handleSelect = (index, nickname) => {
        this.setState({activeIndex: index})
        this.handleChange(`${nickname} `)
    }

    handleChange = (val) => {
        const {onChange} = this.props
        onChange && onChange(val)
    }

    /** 监听键盘事件，注意需设置tabIndex */
    keyDownListener = (e) => {
        const {keyCode} = e
        const {filterList, activeIndex: prevActiveIndex} = this.state
        let activeIndex = 0

        if (keyCode === KEY_CODE.UP) { // 上
            if (prevActiveIndex === 0) {
                activeIndex = filterList.length - 1
            } else {
                activeIndex = prevActiveIndex - 1
            }
            this.setState({activeIndex})
            return
        }
        if (keyCode === KEY_CODE.DOWN) { // 下
            if (prevActiveIndex !== filterList.length - 1) {
                activeIndex = prevActiveIndex + 1
            }
            this.setState({activeIndex})
            return
        }
        if (keyCode === KEY_CODE.ENTER && filterList.length) { // 回车选中
            e.preventDefault()
            this.handleChange(`${this.getNickname(this.state.activeIndex)} `)
        }
    }

    getFilterList = () => {
        const {value, list} = this.props
        return value ? list.filter((v) => v.nickname.indexOf(value) !== -1) : list
    }

    getNickname = (index) => {
        const {filterList} = this.state
        if (filterList[index]) {
            return filterList[index].nickname
        }
        return ''
    }

    render() {
        const {visible, style} = this.props
        const {filterList, activeIndex, tip} = this.state

        return <div id={DOM_ID} styleName="wrapper" className={visible ? '' : 'hide'} style={style}>
            <p styleName="tip">{tip}</p>
            {
                Array.isArray(filterList) && filterList.length
                    ? <div styleName="list" tabIndex={0}>
                        {
                            filterList.map((item, index) => {
                                return <div
                                    key={item.userId}
                                    styleName={`item${activeIndex === index ? ' active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.handleSelect(index, item.nickname)
                                    }}
                                >
                                    {item.nickname}
                                </div>
                            })
                        }
                    </div>
                    : null
            }
        </div>
    }
}
