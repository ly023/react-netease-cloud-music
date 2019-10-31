import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'swiper'

import 'swiper/dist/css/swiper.css'
import './index.scss'

export default class CustomSwiper extends React.PureComponent {
    static propTypes = {
        slides: PropTypes.array,
        showNavigation: PropTypes.bool,
        containerClassName: PropTypes.string,
    }

    static defaultProps = {
        slides: [],
        showNavigation: false,
        containerClassName: '',
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.initSwiper()
    }

    componentDidUpdate() {
        if (this.swiper) {
            this.swiper.destroy()
        }
        this.initSwiper()
    }

    componentWillUnmount() {
        if (this.swiper) {
            // 销毁swiper
            this.swiper.destroy()
        }
    }

    initSwiper = () => {
        this.swiper = new Swiper(this.containerRef, {
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
            paginationClickable :true,
            observer: true,
            observeParents: true,
        })
    }

    render() {
        const {slides, showNavigation, containerClassName} = this.props

        return (
            <>
                <div className={`swiper-container ${containerClassName}`}  ref={(el) => {
                    this.containerRef = el
                }}>
                    <div className="swiper-wrapper">
                        {
                            slides.map((node, i) => {
                                return <div key={i} className="swiper-slide">
                                    {node}
                                </div>
                            })
                        }
                    </div>
                    <div className="swiper-pagination"/>
                </div>
                {
                    showNavigation ? <>
                        <div className="swiper-button-prev"/>
                        <div className="swiper-button-next"/>
                    </> : null
                }
            </>
        )
    }
}
