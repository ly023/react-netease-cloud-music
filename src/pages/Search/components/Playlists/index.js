import {useCallback, memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {PLAY_TYPE} from 'constants/music'
import {PLAYLIST_COLLECTION_TYPE} from 'constants'
import Add from 'components/Add'
import Play from 'components/Play'
import SubscribePlaylist from 'components/SubscribePlaylist'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {formatNumber} from 'utils'
import {getRenderKeyword} from 'utils/song'

import './index.scss'

function Playlists(props) {
    const {keyword = '', list = [], onSubscribeSuccess} = props

    const {userInfo} = useShallowEqualSelector(({user}) => ({userInfo: user.userInfo}))

    const handleSubscribeSuccess = useCallback((index) => {
        onSubscribeSuccess && onSubscribeSuccess(index)
    }, [onSubscribeSuccess])

    return <div styleName="list">
        {
            list.map((item, index)=>{
                const {id, name, creator} = item
                const isEven = (index + 1) % 2 === 0
                const isSelf = creator?.userId === userInfo?.userId
                return <div key={id} styleName={`item${isEven ? ' even' : ''}`}>
                    <div styleName="td">
                        <Play id={id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                            <i styleName="icon play-icon"/>
                        </Play>
                    </div>
                    <Link to={'/'} styleName="td cover">
                        <img src={item.coverImgUrl}/>
                        <div styleName="mask"/>
                    </Link>
                    <div styleName="td name">
                        <Link to={`/playlist/${id}`}>
                            {getRenderKeyword(name, keyword)}
                        </Link>
                    </div>
                    <div styleName="td operation">
                        <Add id={id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                            <a href={null} styleName="icon add-icon" title="添加到播放列表"/>
                        </Add>
                        <SubscribePlaylist
                            id={id}
                            type={item.subscribed ? PLAYLIST_COLLECTION_TYPE.CANCEL : PLAYLIST_COLLECTION_TYPE.OK}
                            disabled={isSelf}
                            onSuccess={() => handleSubscribeSuccess(index)}
                        >
                            <a href={null} styleName="icon favorite-icon" title="收藏"/>
                        </SubscribePlaylist>
                        <a href={null} styleName="icon share-icon" title="分享"/>
                    </div>
                    <div styleName="td trackCount">
                        {item.trackCount}首
                    </div>
                    {
                        creator &&  <Link to={`/user/home/${creator.userId}`} styleName="td creator">
                            by{'\u00A0'}{getRenderKeyword(creator.nickname, keyword)}
                        </Link>
                    }
                    <div styleName="td count">
                        收藏: {formatNumber(item.bookCount, 1)}
                    </div>
                    <div styleName="td count">
                        收听: {formatNumber(item.playCount, 1)}
                    </div>
                </div>
            })
        }
    </div>
}

Playlists.propTypes = {
    keyword: PropTypes.string,
    list: PropTypes.array,
    onSubscribeSuccess: PropTypes.func,
}

export default memo(Playlists)
