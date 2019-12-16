/**
 * 新碟上架
 */
import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import Swiper from 'swiper'
import {PLAY_TYPE} from 'constants/play'
import Play from 'components/Play'
import {requestNewestAlbum} from 'services/album'
import {getThumbnail} from 'utils'

import 'swiper/dist/css/swiper.css'
import './index.scss'

let swiper
let containerRef = React.createRef()

function NewestAlbum() {
    const [newestAlbum, setNewestAlbum] = useState([])
    const isMounted = useRef()

    useEffect(() => {
        const destroySwiper = () => {
            if (swiper) {
                swiper.destroy()
            }
        }

        const fetchNewestAlbum = async () => {
            const res = await requestNewestAlbum()
            if(isMounted.current) {
                setNewestAlbum(Array.isArray(res.albums) ? res.albums.slice(0, 10) : [])
            }
        }

        isMounted.current = true
        fetchNewestAlbum()

        return () => {
            isMounted.current = false
            destroySwiper()
        }
    }, [])

    useEffect(() => {
        const initSwiper = () => {
            const container = containerRef.current
            if(container) {
                swiper = new Swiper(container, {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    loop: true,
                    spaceBetween: 10,
                    speed: 1000,
                    prevButton: '#roller-prev',
                    nextButton: '#roller-next',
                    // navigation: {
                    //     nextEl: '#roller-next',
                    //     prevEl: '#roller-prev',
                    // },
                })
            }
        }
        initSwiper()
    }, [newestAlbum])

    return <div styleName="wrapper">
        <div styleName="list-wrapper">
            <div className="swiper-container" ref={containerRef}>
                <div className="swiper-wrapper" styleName="list">
                    {
                        newestAlbum.map((item, index) => {
                            const {id, name, artist} = item
                            const albumLink = `/album/${id}`
                            return <div key={index} className="swiper-slide">
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
                </div>
            </div>
        </div>
        <div styleName="prev" id="roller-prev"/>
        <div styleName="next" id="roller-next"/>
    </div>
}

export default React.memo(NewestAlbum)
