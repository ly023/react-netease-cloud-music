import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {setUserCommentInfo} from 'actions/user'
import {DEFAULT_AVATAR} from 'constants'
import {formatTimestamp, formatNumber, getThumbnail} from 'utils'
import emitter from 'utils/eventEmitter'
import ReplyEditor from '../ReplyEditor'
import {msgToHtml} from '../Editor/utils'

import './idnex.scss'

@connect(({user})=>({
    isLogin: user.isLogin,
    userInfo : user.userInfo,
    activeCommentId: user.activeCommentId
}))
export default class Comment extends React.Component {

    static propTypes = {
        item: PropTypes.object,
        follows: PropTypes.array,
        onDelete: PropTypes.func,
        onLike: PropTypes.func,
        onReply: PropTypes.func,
        loading: PropTypes.bool,
    }

    static defaultProps = {
        item: {},
        follows: [],
        onDelete(){},
        onLike(){},
        onReply(){},
        loading: false,
    }

    constructor(props) {
        super(props)
        this.state = {
            replyVisible: false
        }
    }

    isAuthor = (userId) => {
        return userId === this.props.userInfo?.userId
    }

    validateLogin = () => {
        const {isLogin} = this.props
        if (isLogin) {
            return true
        }
        emitter.emit('login')
        return false
    }

    handleDelete = (commentId) => {
        this.props.onDelete(commentId)
    }

    handleLike = (commentId, liked) => {
        if(this.validateLogin()) {
            this.props.onLike(commentId, liked)
        }
    }

    toggleReplyEditor = (commentId) => {
        if (this.validateLogin()) {
            if (this.props.activeCommentId !== commentId) {
                this.props.dispatch(setUserCommentInfo({activeCommentId: commentId}))
                this.setState({replyVisible: true})
            } else {
                this.setState((prevState) => {
                    return {
                        replyVisible: !prevState.replyVisible
                    }
                })
            }
        }
    }

    handleReply = (content) => {
        const {item, onReply} = this.props
        onReply(item?.commentId, content)
    }

    getRenderExpression = (item) => {
        return item?.expressionUrl ? <div styleName="expression">
            <img src={getThumbnail(item.expressionUrl, 70)} alt=""/>
        </div> : null
    }

    getRenderReplied = (item) => {
        const repliedComment = item?.beReplied?.[0]
        if (repliedComment) {
            let content
            if (repliedComment.content) {
                content = <>
                    <Link to={`/user/home/${repliedComment.user?.userId}`} styleName="nickname">{repliedComment.user?.nickname}</Link>
                    ：<span dangerouslySetInnerHTML={{__html: msgToHtml(repliedComment.content)}}/>
                    {this.getRenderExpression(repliedComment)}
                </>
            } else {
                content = '该评论已删除'
            }
            return <div styleName="replied">{content}</div>
        }
        return null
    }

    render() {
        const {activeCommentId, follows, item, loading} = this.props
        const {replyVisible} = this.state

        return (
            <div id={`comment-item-${item?.commentId}`} styleName="item">
                <img
                    styleName="avatar"
                    src={item?.user?.avatarUrl}
                    alt="头像"
                    onError={(e) => {
                        e.target.scr = DEFAULT_AVATAR
                    }}
                />
                <div styleName="text">
                    <div styleName="comment">
                        <Link to={`/user/home/${item?.user?.userId}`} styleName="nickname">{item?.user?.nickname}</Link>
                        ：<span dangerouslySetInnerHTML={{__html: msgToHtml(item?.content)}}/>
                        {this.getRenderExpression(item)}
                    </div>
                    {this.getRenderReplied(item)}
                    <div styleName="feedback">
                        <span styleName="time">{formatTimestamp(item?.time)}</span>
                        <div>
                            {this.isAuthor(item?.user?.userId) ? <>
                                <span styleName="delete" onClick={() => this.handleDelete(item?.commentId)}>删除</span>
                                <span styleName="space">|</span></> : null}
                            <span styleName={`like${item?.liked ? ' liked' : ''}`} onClick={() => this.handleLike(item?.commentId, item?.liked)}>
                                <i/>
                                {item?.likedCount ? `(${formatNumber(item.likedCount, 5, 1)})` : null}
                            </span>
                            <span styleName="space">|</span>
                            <span styleName="reply" onClick={() => this.toggleReplyEditor(item?.commentId)}>回复</span>
                        </div>
                    </div>
                    {
                        replyVisible && activeCommentId === item?.commentId
                            ? <ReplyEditor
                                follows={follows}
                                initialValue={`回复${item?.user?.nickname}:`}
                                onSubmit={this.handleReply}
                                loading={loading}
                            />
                            : null
                    }
                </div>
            </div>
        )
    }
}
