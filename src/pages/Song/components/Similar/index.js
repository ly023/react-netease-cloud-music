/**
 * 相似内容
 */
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Add from 'components/Add'
import {PLAY_TYPE} from 'constants/play'
import Play from 'components/Play'
import {getArtists} from 'utils/song'

import './index.scss'

const Similar = ({playlists, songs}) => {
    // todo 登录状态下显示喜欢这首歌的人，暂无接口
    return (
        <>
            {
                playlists.length ? <div styleName="playlists">
                    <h3 styleName="title">包含这首歌的歌单</h3>
                    <ul>
                        {
                            playlists.map((item) => {
                                return <li key={item.id}>
                                    <Link to={`/playlist/${item.id}`} title={item.name} styleName="cover">
                                        <img src={item.coverImgUrl} alt="cover"/>
                                    </Link>
                                    <div styleName="meta">
                                        <p styleName="name"><Link to={`/playlist/${item.id}`} title={item.name}>{item.name}</Link></p>
                                        <p><span styleName="by">by</span><Link styleName="nickname" to={`/user/home/${item?.creator?.userId}`}
                                            title={item?.creator?.nickname}>{item?.creator?.nickname}</Link>
                                        </p>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </div> : null
            }
            {
                songs.length ? <div styleName="songs">
                    <h3 styleName="title">相似歌曲</h3>
                    <ul>
                        {
                            songs.map((item) => {
                                return <li key={item.id}>
                                    <div styleName="text">
                                        <p><Link to={`/song/${item.id}`} title={item.name}>{item.name}</Link></p>
                                        <div styleName="singer" title={getArtists(item.artists)}>
                                            {
                                                item.artists.map((artist, i) => {
                                                    return <span key={artist.id}><Link
                                                        to={`/artist/${artist.id}`}>{artist.name}</Link>{i !== item.artists.length - 1 ? '/' : ''}</span>
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div styleName="operation">
                                        <Play id={item.id} type={PLAY_TYPE.SINGLE.TYPE}>
                                            <a styleName="icon play-icon" href={null}/>
                                        </Play>
                                        <Add id={item.id} type={PLAY_TYPE.SINGLE.TYPE}>
                                            <a styleName="icon add-icon" href={null}/>
                                        </Add>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </div> : null
            }
            <div styleName="multiple-client">
                <h3 styleName="title">网易云音乐多端下载</h3>
                <ul styleName="bg">
                    <li>
                        <a href="https://itunes.apple.com/cn/app/id590338362" styleName="ios" hidefocus="true" target="_blank">iPhone</a>
                    </li>
                    <li>
                        <a href="https://music.163.com/api/pc/download/latest" styleName="pc" hidefocus="true" target="_blank">PC</a>
                    </li>
                    <li>
                        <a href="https://music.163.com/api/android/download/latest2" styleName="aos" hidefocus="true" target="_blank">Android</a>
                    </li>
                </ul>
                <p styleName="tip">同步歌单，随时畅听320k好音乐</p>
            </div>
        </>
    )
}

Similar.propTypes = {
    playlists: PropTypes.array,
    songs: PropTypes.array,
}

export default Similar

