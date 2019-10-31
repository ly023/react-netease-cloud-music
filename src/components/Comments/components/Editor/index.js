/**
 * 编辑器
 */
import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {DOUBLE_BYTE_CHAR_PATTERN} from 'constants'
import KEY_CODE from 'constants/keyCode'
import {getCursorPosition} from 'utils'
import emitter from 'utils/eventEmitter'
import message from 'components/Message'

import EmojiPanel from './components/EmojiPanel'
import AtList from './components/AtList'

import './index.scss'

const MAX_WORDS_NUMBER = 140

@connect(({user}) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo,
}))
export default class Editor extends React.Component {

    static propTypes = {
        onRef: PropTypes.func,
        follows: PropTypes.array,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        initialValue: PropTypes.string,
        submitText: PropTypes.string,
        onSubmit: PropTypes.func,
        loading: PropTypes.bool,
    }

    static defaultProps = {
        follows: [],
        initialValue: '',
        textBoxStyle: {},
        onRef() {
        },
        submitText: '评论',
        onSubmit() {
        },
        loading: false
    }

    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            remainingWordsNumber: MAX_WORDS_NUMBER,
            value: this.props.initialValue,
            atList: [],
            emojiPanelVisible: false,
            atListVisible: false,
            atListStyle: {},
            atCursorStart: 0,
            atText: '',
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {follows} = nextProps
        if (follows.length && follows.length !== prevState.atList.length) {
            return {
                atList: follows
            }
        }
        return null
    }

    componentDidMount() {
        this.props.onRef(this) // 将组件实例this传递给onRef方法

        if (this.inputRef) {
            this.inputRef.addEventListener('keydown', this.keyDownListener)
            // 点击输入框，寻找光标所在位置
            this.inputRef.addEventListener('click', this.clickListener)
        }
    }

    componentWillUnmount() {
        this.inputRef.removeEventListener('keydown', this.keyDownListener)
        // 点击输入框，寻找光标所在位置
        this.inputRef.removeEventListener('click', this.clickListener)
    }

    focus = () => {
        this.inputRef.focus()
    }

    keyDownListener = (e) => {
        const {keyCode} = e

        if (keyCode === KEY_CODE.LEFT || keyCode === KEY_CODE.RIGHT) {
            const {value} = this.state
            const [cursorStart] = getCursorPosition(this.inputRef)
            let start = 0
            if (keyCode === KEY_CODE.LEFT) {
                start = cursorStart - 1 < 0 ? 0 : cursorStart - 1
            } else {
                start = cursorStart + 1 > value.length ? value.length : cursorStart + 1
            }
            window.setTimeout(() => {
                this.setSelectionRange(start, start)
                this.triggerAtList()
            }, 0)
        } else if (keyCode === KEY_CODE.UP || keyCode === KEY_CODE.DOWN || keyCode === KEY_CODE.ENTER) {
            // at 列表显示时 输入框禁用上下及回车键
            if (this.state.atListVisible) {
                e.preventDefault()
            }
        }
    }

    clickListener = () => {
        if (this.validateLogin()) {
            this.triggerAtList()
        }
    }

    validateLogin = () => {
        const {isLogin} = this.props
        if (isLogin) {
            return true
        }
        emitter.emit('login')
        return false
    }

    handleSubmit = () => {
        if (this.validateLogin() && !this.props.loading) {
            const {remainingWordsNumber, value} = this.state
            if (remainingWordsNumber === MAX_WORDS_NUMBER) {
                message.error({
                    content: '输入点内容再提交吧'
                })
                return
            }
            if (remainingWordsNumber < 0) {
                message.error({
                    content: '输入不能超过140个字符'
                })
                return
            }
            this.props.onSubmit(value)
        }
    }

    handleInput = (e) => {
        const value = e && e.target ? e.target.value : e
        this.setInputValue(value, () => {
            this.triggerAtList(value)
        })
    }

    setInputValue = (value, callback) => {
        if (typeof value !== 'string') {
            value = ''
        }
        // 双字节算一个字，单字节算半个字，向上取整
        const doubleByteChar = value.match(new RegExp(DOUBLE_BYTE_CHAR_PATTERN, 'g'))
        const doubleByteCharNumber = doubleByteChar ? doubleByteChar.length : 0
        const charNumber = Math.ceil((value.length - doubleByteCharNumber) / 2)
        const remainingWordsNumber = MAX_WORDS_NUMBER - (charNumber + doubleByteCharNumber)

        this.setState({
            value,
            remainingWordsNumber
        }, () => {
            callback && callback()
        })
    }

    handleFocus = () => {
        this.validateLogin()
    }

    showEmojiPanel = () => {
        if (this.validateLogin()) {
            this.setState({emojiPanelVisible: true})
        }
    }

    hideEmojiPanel = () => {
        this.setState({emojiPanelVisible: false})
    }

    handleChangeEmoji = (val) => {
        this.handleInsert(val)
        this.hideEmojiPanel()
    }

    setInputRef = (el) => {
        this.inputRef = el
    }

    showAtList = () => {
        if (this.validateLogin()) {
            const {value} = this.state
            const [cursorStart, cursorEnd] = getCursorPosition(this.inputRef)
            const newValue = `${value.substring(0, cursorStart)}@${value.substring(cursorEnd)}`
            const atCursorStart = cursorStart + 1
            this.setInputValue(newValue, () => {
                this.setSelectionRange(atCursorStart, atCursorStart)
                this.triggerAtList()
            })
        }
    }

    hideAtList = () => {
        this.setState({atListVisible: false})
    }

    triggerAtList = (value) => {
        if (typeof value === 'undefined') {
            value = this.state.value
        }

        if (value) {
            const [cursorStart] = getCursorPosition(this.inputRef)
            const atCursorStart = this.getAtCursor(value, cursorStart)

            this.setState({
                atCursorStart: atCursorStart
            }, () => {
                // autoHeight为false的情况下，与textarea输入框保持一致
                const hasScrollbar = this.inputRef.scrollHeight !== this.inputRef.clientHeight
                if (hasScrollbar) {
                    this.setState({
                        displayStyle: {overflowY: 'scroll'}
                    })
                } else {
                    this.setState({
                        displayStyle: {overflowY: 'auto'}
                    })
                }

                const atText = this.getAtText(value, cursorStart)

                // @与光标之间符合昵称的规则，或前一个字符为@，就认为还在查找@列表或者还在输入
                if (/^[a-zA-Z0-9_\-一-龥]{1,15}$/.test(atText) || (atCursorStart && atCursorStart === cursorStart)) {
                    const displayRect = this.displayRef.getBoundingClientRect()
                    const markRect = this.markRef.getBoundingClientRect()
                    const top = markRect.top - displayRect.top
                    const left = markRect.left - displayRect.left
                    const topOffset = 10 - this.inputRef.scrollTop
                    const leftOffset = -12

                    this.setState({
                        atListVisible: true,
                        atText: atText,
                        atListStyle: {
                            top: top + topOffset,
                            left: left + leftOffset,
                        }
                    })
                    return
                }

                this.setState({
                    atListVisible: false
                })
            })
            return
        }
        this.setState({
            atListVisible: false
        })
    }

    handleChangeAt = (val) => {
        this.handleInsert(val)
        this.hideAtList()
    }

    handleInsert = (val) => {
        if (val) {
            const {value} = this.state
            // 在重新赋值前focus的位置
            const [cursorStart, cursorEnd] = getCursorPosition(this.inputRef)

            const atText = this.getAtText(value, cursorStart)
            const insertedValue = val.substr(atText.length)
            const newValue = `${value.substring(0, cursorStart)}${insertedValue}${value.substring(cursorEnd)}`
            const insertedLen = insertedValue.length

            // 改变输入框的值后，焦点会移到最后，手动设置焦点位置
            this.setInputValue(newValue, () => {
                this.setSelectionRange(cursorStart + insertedLen, cursorEnd + insertedLen)
            })
        }
    }

    setSelectionRange = (cursorStart, cursorEnd) => {
        this.inputRef.selectionStart = cursorStart
        this.inputRef.selectionEnd = cursorEnd
        this.inputRef.focus()
        // this.inputRef.setSelectionRange(cursorStart, cursorEnd)
    }

    getAtText = (value, cursorStart) => {
        const subStr = value.substring(0, cursorStart)
        const lastIndex = subStr.lastIndexOf('@')
        if (lastIndex !== -1) {
            return subStr.substring(lastIndex + 1)
        }
        return ''
    }

    getAtCursor = (value, cursorStart) => {
        const subStr = value.substring(0, cursorStart)
        const lastIndex = subStr.lastIndexOf('@')
        if (lastIndex !== -1) {
            return lastIndex + 1
        }
        return 0
    }

    clear = () => {
        this.setState(this.getInitialState())
    }

    setDisplayRef = (el) => {
        this.displayRef = el
    }

    setMarkRef = (el) => {
        this.markRef = el
    }

    render() {
        const {className, placeholder, submitText, loading} = this.props
        const {
            remainingWordsNumber, value, atList, emojiPanelVisible, atListVisible, atListStyle, atCursorStart, displayStyle = {}, atText,
        } = this.state

        return (
            <div className={className}>
                <div styleName="text-wrapper">
                    <textarea
                        ref={this.setInputRef}
                        id="comment-at-list-input"
                        placeholder={placeholder}
                        styleName="textarea"
                        value={value}
                        onChange={this.handleInput}
                        onFocus={this.handleFocus}
                    />
                    {/* 用来计算光标的位置 -- start */}
                    <div styleName="textarea display" ref={this.setDisplayRef} style={displayStyle}>
                        {value.substr(0, atCursorStart)}<span styleName="mark" ref={this.setMarkRef}/>
                    </div>
                    {/* 用来计算光标的位置 -- end */}
                    <AtList
                        visible={atListVisible}
                        list={atList}
                        style={atListStyle}
                        value={atText}
                        onChange={this.handleChangeAt}
                        onCancel={this.hideAtList}
                    />
                </div>
                <div className="clearfix" styleName="operation">
                    <i id="comment-emoji-panel-icon" styleName="icon emoji-icon" onClick={this.showEmojiPanel}/>
                    <i id="comment-at-list-icon" styleName="icon at-icon" onClick={this.showAtList}/>
                    <a styleName={`submit${loading ? ' loading' : ''}`} onClick={this.handleSubmit}>{submitText}{loading ? '...' : ''}</a>
                    <span styleName={`count${remainingWordsNumber < 0 ? ' error' : ''}`}>{remainingWordsNumber}</span>
                    <EmojiPanel
                        visible={emojiPanelVisible}
                        onChange={this.handleChangeEmoji}
                        onCancel={this.hideEmojiPanel}
                    />
                </div>
            </div>
        )
    }
}
