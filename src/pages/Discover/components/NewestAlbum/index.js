/**
 * 新碟上架
 */
import {useState, useEffect, useMemo, useRef, memo} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import {PLAY_TYPE} from 'constants/music'
import Play from 'components/Play'
import {requestNewestAlbum} from 'services/album'
import {getThumbnail} from 'utils'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.scss'

const TOTAL_LENGTH = 10 // 总专辑数
const SLIDES_PER_ROW = 5 // 每行显示专辑数

function NewestAlbum() {
    const [newestAlbums, setNewestAlbum] = useState([])
    const isMounted = useRef(false)

    useEffect(() => {
        const fetchNewestAlbum = async () => {
            const res = await requestNewestAlbum()
            if(isMounted.current) {
                setNewestAlbum(Array.isArray(res.albums) ? res.albums.slice(0, TOTAL_LENGTH) : [])
            }
        }

        isMounted.current = true
        fetchNewestAlbum()

        return () => {
            isMounted.current = false
        }
    }, [])

    const settings = useMemo(() => ({
        dots: false,
        slidesPerRow: SLIDES_PER_ROW,
    }), [])

    return <div styleName="wrapper">
        {
            newestAlbums.length ? <Slider {...settings} styleName="list">
                {
                    newestAlbums.map((item, index) => {
                        const {id, name, artist} = item
                        const albumLink = `/album/${id}`
                        return <div key={index}>
                            <div styleName="item">
                                <div styleName="cover">
                                    <Link to={albumLink}>
                                        <img
                                            src={getThumbnail(item.picUrl, 100)}
                                            alt={name}
                                        />
                                        <span styleName="mask"/>
                                    </Link>
                                    <Play id={id} type={PLAY_TYPE.ALBUM.TYPE}>
                                        <span styleName="play-icon"/>
                                    </Play>
                                </div>
                                <Link to={albumLink} styleName="title">{name}</Link>
                                <Link to="/" styleName="name">{artist && artist.name}</Link>
                            </div>
                        </div>
                    })
                }
            </Slider> : null
        }
    </div>
}

export default memo(NewestAlbum)
