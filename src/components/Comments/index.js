/**
 * 歌曲、歌单、专辑、mv评论
 */
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {cloneDeep} from 'lodash'
import {setUserCommentInfo} from 'actions/user'
import {DEFAULT_AVATAR, PAGINATION_LIMIT} from 'constants'
import {requestFollows} from 'services/user'
import {
    requestMusicComments, requestPlaylistComments, requestAlbumComments, requestMVComments,
    comment, like
} from 'services/comment'
import Pagination from 'components/Pagination'
import message from 'components/Message'
import Comment from './components/Comment'
import Editor from './components/Editor'

import './index.scss'

const COMMENT_TYPES = {
    MUSIC: {
        TYPE: 0,
        REQUEST: requestMusicComments
    },
    PLAYLIST: {
        TYPE: 2,
        REQUEST: requestPlaylistComments
    },
    ALBUM: {
        TYPE: 3,
        REQUEST: requestAlbumComments
    },
    MV: {
        TYPE: 1,
        REQUEST: requestMVComments
    }
}

const ACTION_TYPES = {
    DELETE: 0, // 删除
    CREATE: 1, // 发送
    REPLAY: 2, // 回复
}

@connect(({user}) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo
}))
export default class Comments extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        type: PropTypes.oneOf(Object.keys(COMMENT_TYPES)),
        onRef: PropTypes.func,
    }

    static defaultProps = {
        type: Object.keys(COMMENT_TYPES)[0],
        onRef(){}
    }

    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            follows: [], // 关注的人
            topComments: [], // 置顶评论
            hotComments: [], // 热门评论
            comments: [], // 评论
            total: 0, // 总数
            current: 1, // 当前页码
            offset: 0, // 偏移量,
            commentLoading: false,
            deleteLoading: false,
            likeLoading: false,
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.props.onRef(this)
        this.requestFunc = COMMENT_TYPES[this.props.type].REQUEST
        this.fetchFollows()
        this.fetchComments()
    }

    componentDidUpdate(prevProps) {
        if(this.props.id !== prevProps.id) {
            this.setState(this.getInitialState())
            this.fetchComments()
        }
        if(this.props.isLogin && !prevProps.isLogin) {
            this.fetchFollows()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchFollows = () => {
        const {userInfo: {userId}} = this.props
        if (userId) {
            requestFollows({uid: userId})
                .then((res) => {
                    if (this._isMounted && res) {
                        const follows = res.follow || []
                        this.setState({
                            follows: follows,
                        })
                    }
                })
        }
    }

    fetchComments = (offset = 0, scroll = false) => {
        const params = {
            id: this.props.id,
            offset
        }
        this.requestFunc(params).then((res) => {
            if (this._isMounted && res) {
                const {topComments = [], hotComments = [], comments = [], total = 0} = res
                this.setState({
                    offset,
                    total,
                    topComments, hotComments, comments
                })
                if (scroll) {
                    if (offset) {
                        document.getElementById('new-comments-content').scrollIntoView()
                        return
                    }
                    document.getElementById('comments-content').scrollIntoView()
                    return
                }
                this.setTotalComment(total)
            }
        })
    }

    handlePageChange = (page) => {
        this.setState({
            current: page
        })
        this.fetchComments((page - 1) * PAGINATION_LIMIT, true)
    }

    setTotalComment = (total) => {
        const {setTotalComment} = this.props
        setTotalComment && setTotalComment(total)
    }

    setEditorRef = (ref) => {
        this.editorRef = ref
    }

    focusEditor = () => {
        this.editorRef.focus()
        document.getElementById('comment-wrapper').scrollIntoView()
    }

    getCommentKey = (commentId) => {
        if (this.state.comments.find(v => v.commentId === commentId)) {
            return 'comments'
        }
        if (this.state.hotComments.find(v => v.commentId === commentId)) {
            return 'hotComments'
        } else {
            return 'topComments'
        }
    }

    getCommonBody = () => {
        const {id, type} = this.props
        return {
            id: id,
            type: COMMENT_TYPES[type].TYPE,
        }
    }

    handleCreateComment = (content) => {
        const body = {
            ...this.getCommonBody(),
            t: ACTION_TYPES.CREATE,
            content: content
        }
        if(this.state.commentLoading) {
            return
        }
        this.setState({commentLoading: true})
        comment(body)
            .then((res) => {
                if (this._isMounted && res.code === 200) {
                    this.setState((prevState) => {
                        return {
                            total: prevState.total + 1,
                            comments: [res.comment].concat(prevState.comments)
                        }
                    }, () =>{
                        // 清空评论框
                        this.editorRef.clear()
                        // 定位到当前评论
                        document.getElementById(`comment-item-${res.comment.commentId}`).scrollIntoView()
                        // 弹窗提示
                        message.success({
                            content: '评论成功'
                        })
                    })
                }
            })
            .finally(()=>{
                this.setState({commentLoading: false})
            })
    }

    handleDeleteComment = (commentId) => {
        const body = {
            ...this.getCommonBody(),
            t: ACTION_TYPES.DELETE,
            commentId: commentId
        }
        if (this.state.deleteLoading) {
            return
        }
        this.setState({deleteLoading: true})
        comment(body)
            .then((res) => {
                if (this._isMounted && res.code === 200) {
                    this.setState((prevState) => {
                        const commentKey = this.getCommentKey(commentId)
                        return {
                            [commentKey]: prevState[commentKey].filter((v) => v.commentId !== commentId),
                            total: commentKey === 'comments' ? prevState.total - 1 : prevState.total
                        }
                    })
                    message.success({
                        content: '删除成功'
                    })
                }
            })
            .finally(() => {
                this.setState({deleteLoading: false})
            })
    }

    handleLikeComment = (commentId, liked) => {
        const body = {
            ...this.getCommonBody(),
            cid: commentId,
            t: liked ? 0 : 1, // 1点赞 0取消点赞
        }
        if (this.state.likeLoading) {
            return
        }
        this.setState({likeLoading: true})
        like(body)
            .then((res) => {
                if (this._isMounted && res.code === 200) {
                    const commentKey = this.getCommentKey(commentId)
                    const comments = cloneDeep(this.state[commentKey])
                    const comment = comments.find(v => v.commentId === commentId)
                    comment.liked = !liked
                    comment.likedCount = !liked ? comment.likedCount + 1 : comment.likedCount - 1
                    this.setState({
                        [commentKey]: comments
                    })
                }
            })
            .finally(() => {
                this.setState({likeLoading: false})
            })
    }

    handleReplyComment = (commentId, content) => {
        const body = {
            ...this.getCommonBody(),
            t: ACTION_TYPES.REPLAY,
            commentId: commentId,
            content: content,
        }
        if(this.state.replyLoading) {
            return
        }
        this.setState({replyLoading: true})
        comment(body)
            .then((res) => {
                if (this._isMounted && res.code === 200) {
                    this.setState((prevState) => {
                        return {
                            total: prevState.total + 1,
                            comments: [res.comment].concat(prevState.comments)
                        }
                    }, () => {
                        // 定位到当前评论
                        document.getElementById(`comment-item-${res.comment.commentId}`).scrollIntoView()
                        this.props.dispatch(setUserCommentInfo({activeCommentId: 0}))
                        message.success({
                            content: '回复成功'
                        })
                    })
                }
            })
            .finally(() => {
                this.setState({replyLoading: false})
            })
    }

    getRenderComments = (comments) => {
        if (Array.isArray(comments)) {
            const {follows, replyLoading} = this.state
            return comments.map((item) => {
                return <Comment
                    key={item.commentId}
                    item={item}
                    follows={follows}
                    onDelete={this.handleDeleteComment}
                    onLike={this.handleLikeComment}
                    onReply={this.handleReplyComment}
                    loading={replyLoading}
                />
            })
        }
        return null
    }

    render() {
        const {isLogin, userInfo} = this.props
        const {
            follows,
            topComments, hotComments, comments, total, current, offset,
            commentLoading,
        } = this.state

        return (
            <div id="comment-wrapper">
                <div styleName="title">
                    <h3><span>评论</span></h3><span styleName="count">共{total}条评论</span>
                </div>
                <div styleName="content">
                    <div styleName="editor-wrapper">
                        <img
                            styleName="avatar"
                            src={isLogin ? userInfo?.avatarUrl : ''}
                            alt="头像"
                            onError={(e) => {
                                e.target.src = DEFAULT_AVATAR
                            }}
                        />
                        <div styleName="editor">
                            <Editor onRef={this.setEditorRef} follows={follows} onSubmit={this.handleCreateComment} loading={commentLoading}/>
                        </div>
                    </div>
                    <div id="comments-content">
                        {
                            topComments.length ? <div>
                                <h4 styleName="sub-title">置顶评论</h4>
                                {this.getRenderComments(topComments)}
                            </div> : null
                        }
                        {
                            hotComments.length ? <div styleName="hot-comment">
                                {offset ? null : <h4 styleName="sub-title">精彩评论</h4>}
                                {this.getRenderComments(hotComments)}
                            </div> : null
                        }
                        {
                            comments.length ? <div id="new-comments-content">
                                {current === 1 ? <h4 styleName="sub-title">最新评论({total})</h4> : null}
                                {this.getRenderComments(comments)}
                                <div styleName="pagination">
                                    <Pagination
                                        total={Math.ceil(total / PAGINATION_LIMIT)}
                                        current={current}
                                        onChange={this.handlePageChange}
                                    />
                                </div>
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}
