/**
 * 首页轮播图
 */
import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import {requestDiscoverBanners} from 'services/banners'
import {getBlur, getThumbnail} from 'utils'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.scss'

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
            }
        }

        isMounted.current = true
        fetchBanners()

        return () => {
            isMounted.current = false
        }
    }, [])

    const afterChange = useCallback((index) => {
        const banner = banners[index]
        if (banner) {
            setActiveUrl(banner.imageUrl)
        }
    }, [banners])

    const settings = useMemo(() => ({
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,
        dots: true,
        fade: true,
        pauseOnHover: true,
        afterChange,
    }), [afterChange])

    const backgroundStyle = useMemo(() => ({
        backgroundImage: `url(${getBlur(activeUrl)})`,
        backgroundSize: '6000px',
    }), [activeUrl])

    return <section style={backgroundStyle}>
        <div styleName='banner'>
            {
                banners.length ? <Slider {...settings}>
                    {
                        banners.map((v, i) => {
                            const imageUrl = getThumbnail(v.imageUrl, 730, 284)
                            return <div key={i} styleName="slide">
                                {
                                    v.targetType === 1
                                        ? <a style={{display: 'block'}} href={`/song/${v.targetId}`}>
                                            <img src={imageUrl} alt=""/>
                                        </a>
                                        : <img src={imageUrl} alt=""/>
                                }
                            </div>
                        })
                    }
                </Slider> : null
            }
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
