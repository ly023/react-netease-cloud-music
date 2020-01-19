import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import Swiper from 'swiper'
import {requestDiscoverBanners} from 'services/banners'
import {getBlur} from 'utils'

import 'swiper/dist/css/swiper.css'
import './index.scss'

let swiper
let containerRef = React.createRef()

function Banner() {
    const [banners, setBanners] = useState([])
    const [activeUrl, setActiveUrl] = useState('')
    const isMounted = useRef()

    useEffect(() => {
        const fetchBanners = async () => {
            const res = await requestDiscoverBanners()
            const banners = res.banners || []
            if (isMounted.current) {
                setBanners(banners)
                setActiveUrl(banners.length ? banners[0].imageUrl : '')

                const initSwiper = () => {
                    const container = containerRef.current
                    if(container) {
                        swiper = new Swiper(container, {
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false, // 操作swiper之后自动切换不会停止
                            effect: 'fade',
                            fadeEffect: {
                                crossFade: true // 开启淡出
                            },
                            loop: true,
                            prevButton:'.swiper-button-prev',
                            nextButton:'.swiper-button-next',
                            // pagination: {
                            //     el: this.paginationRef,
                            //     clickable: true,
                            // },
                            pagination : '.swiper-pagination',
                            paginationClickable: true,
                            observer: true,
                            observeParents: true,
                            onSlideChangeStart: ({activeIndex}) => {
                                const len = banners.length
                                const realActiveIndex = (activeIndex - 1) % len
                                const banner = banners[realActiveIndex]
                                if(banner) {
                                    setActiveUrl(banner.imageUrl)
                                }
                            }
                        })
                    }
                }
                initSwiper()
            }
        }

        const destroySwiper = () => {
            if (swiper) {
                swiper.destroy()
            }
        }

        isMounted.current = true
        fetchBanners()

        return () => {
            isMounted.current = false
            destroySwiper()
        }
    }, [])

    return <section
        style={{
            backgroundImage: `url(${getBlur(activeUrl)})`,
            backgroundSize: '6000px'
        }}>
        <div styleName='banner'>
            <div className="swiper-container" styleName="banner-content"  ref={containerRef}>
                <div className="swiper-wrapper">
                    {
                        banners.map((v, i) => {
                            const {imageUrl} = v
                            return <div key={i} className="swiper-slide">
                                {
                                    v.targetType === 1
                                        ? <a style={{display: 'inline-block'}} href={`/song/${v.targetId}`}>
                                            <img src={imageUrl} alt=""/>
                                        </a>
                                        : <img src={imageUrl} alt=""/>
                                }
                            </div>
                        })
                    }
                </div>
                <div className="swiper-pagination"/>
            </div>
            <div className="swiper-button-prev"/>
            <div className="swiper-button-next"/>
            <div styleName='download'>
                <Link to='/download' hidefocus='true'>下载客户端</Link>
                <p>PC 安卓 iPhone WP iPad Mac 六大客户端</p>
                <span styleName='shadow-left'/>
                <span styleName='shadow-right'/>
            </div>
        </div>
    </section>
}

export default Banner
