import {useState, useEffect, useRef, memo} from 'react'
import {Link} from 'react-router-dom'
import {requestTopArtist} from 'services/artist'
import {getThumbnail} from 'utils'

import './index.scss'

function Singer() {
    const [artists, setArtists] = useState([])
    const isMounted = useRef(false)

    useEffect(() => {
        const fetchArtist = async () => {
            const params = {limit: 8}
            const res = await requestTopArtist(params)
            if (isMounted.current) {
                setArtists(res.artists)
            }
        }

        isMounted.current = true
        fetchArtist()

        return () => {
            isMounted.current = false
        }
    }, [])

    return <section styleName="wrapper">
        <h3 styleName="title">
            <span className="fl">热门歌手</span>
            <a href={null} styleName="more">查看全部 ></a>
        </h3>
        <ul styleName="list">
            {
                artists.map((item) => {
                    const {id, accountId, name, alias, picUrl} = item
                    return <li key={id} styleName="item">
                        <Link to={`/user/home/${accountId}`}>
                            <img src={getThumbnail(picUrl, 62)} styleName="item-avatar" alt="头像"/>
                            <div styleName="item-info">
                                <h4 styleName="item-nickname">{name}{alias?.[0]}</h4>
                                <p styleName="item-desc">暂无描述</p>
                            </div>
                        </Link>
                    </li>
                })
            }
        </ul>
    </section>
}

export default memo(Singer)
