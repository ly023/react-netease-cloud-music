/**
 * 首页轮播图
 */
import {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import {requestDiscoverBanners} from 'services/banners'
import {getBlur, getThumbnail} from 'utils'
import {TARGET_TYPE} from './constants'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.scss'

function Banner() {
    const [banners, setBanners] = useState([])
    const [activeUrl, setActiveUrl] = useState('')
    const isMounted = useRef(false)

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

    const beforeChange = useCallback((oldIndex, newIndex) => {
        const banner = banners[newIndex]
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
        beforeChange,
    }), [beforeChange])

    const backgroundStyle = useMemo(() => ({
        backgroundImage: `url(${getBlur(activeUrl)})`,
        backgroundSize: '6000px',
    }), [activeUrl])

    const renderImage = useCallback((item) => {
        const {targetType, targetId, imageUrl} = item
        const thumbnail = getThumbnail(imageUrl, 730, 284)
        const image = <img src={thumbnail} alt=""/>
        switch (targetType) {
            case TARGET_TYPE.SONG.TYPE:
                return <Link to={`/song/${targetId}`}>
                    {image}
                </Link>
            case TARGET_TYPE.ALBUM.TYPE:
                return <Link to={`/album/${targetId}`}>
                    {image}
                </Link>
            default:
                return image
        }
    }, [])

    const renderBanners = useMemo(() => {
        if(banners.length) {
            return <Slider {...settings}>
                {
                    banners.map((v, i) => {
                        return <div key={i} styleName="slide">
                            {renderImage(v)}
                        </div>
                    })
                }
            </Slider>
        }
    }, [banners, settings, renderImage])

    return <section style={backgroundStyle}>
        <div styleName='banner'>
            {renderBanners}
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
