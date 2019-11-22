/**
 * 新碟上架
 */
import React, {useState, useEffect} from 'react'
import Swiper from 'swiper'
import {PLAY_TYPE} from 'constants/play'
import Play from 'components/Play'
import {requestNewestAlbum} from 'services/album'

import 'swiper/dist/css/swiper.css'
import './index.scss'

function NewestAlbum() {
    const [newestAlbum, setNewestAlbum] = useState([])
    let isMounted = false
    let swiper
    let containerRef

    const initSwiper = () => {
        if (containerRef) {
            swiper = new Swiper(containerRef, {
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

    const destroySwiper = () => {
        if (swiper) {
            swiper.destroy()
        }
    }

    const fetchNewestAlbum = async () => {
        const res = await requestNewestAlbum()
        if(isMounted) {
            setNewestAlbum(Array.isArray(res.albums) ? res.albums.slice(0, 10) : [])
        }
    }

    useEffect(() => {
        isMounted = true
        fetchNewestAlbum()
        return () => {
            isMounted = false
            destroySwiper()
        }
    }, [])

    useEffect(() => {
        initSwiper()
    }, [newestAlbum])

    return <div styleName="wrapper">
        <div styleName="list-wrapper">
            <div className="swiper-container" ref={(el) => {containerRef = el}}>
                <div className="swiper-wrapper" styleName="list">
                    {
                        newestAlbum.map((item, index) => {
                            return <div key={index} className="swiper-slide" styleName='item'>
                                <div styleName='cover'>
                                    <img
                                        src={item.picUrl}
                                        alt={item.name}
                                    />
                                    <a styleName='mask'/>
                                    <Play id={item.id} type={PLAY_TYPE.ALBUM.TYPE}>
                                        <a styleName='play-icon'/>
                                    </Play>
                                </div>
                                <a styleName='title'>{item.name}</a>
                                <a styleName='name'>{item.artist && item.artist.name}</a>
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
