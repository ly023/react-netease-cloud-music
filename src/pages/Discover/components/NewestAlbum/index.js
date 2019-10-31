/**
 * 新碟上架
 */
import React from 'react'
import Swiper from 'swiper'
import {PLAY_TYPE} from 'constants/play'
import Play from 'components/Play'
import {requestNewestAlbum} from 'services/album'

import 'swiper/dist/css/swiper.css'
import './index.scss'

export default class NewestAlbum extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            newestAlbum: []
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchNewestAlbum()
        if (this.swiper) {
            this.swiper.destroy()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
        if (this.swiper) {
            this.swiper.destroy()
        }
    }

    fetchNewestAlbum = () => {
        requestNewestAlbum()
            .then((res) => {
                if(this._isMounted) {
                    this.setState({
                        newestAlbum: Array.isArray(res.albums) ? res.albums.slice(0, 10) : []
                    }, () => {
                        this.initSwiper()
                    })
                }
            })
    }

    initSwiper = () => {
        this.swiper = new Swiper(this.containerRef, {
            slidesPerView: 5,
            slidesPerGroup: 5,
            loop: true,
            spaceBetween: 10,
            speed: 1000,
            prevButton:'#roller-prev',
            nextButton:'#roller-next',
            // navigation: {
            //     nextEl: '#roller-next',
            //     prevEl: '#roller-prev',
            // },
        })
    }

    render() {
        const {newestAlbum} = this.state

        return (
            <div styleName="wrapper">
                <div styleName="list-wrapper">
                    <div className="swiper-container" ref={(el) => {this.containerRef = el}}>
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
        )
    }
}
