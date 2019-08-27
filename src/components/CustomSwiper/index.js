import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
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
            autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: false // 操作swiper之后自动切换不会停止
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true // 开启淡出
            },
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: this.paginationRef,
                clickable: true,
            },
            observer: true,
            observeParents: true,
        })
    }

    render() {
        const {slides, showNavigation, containerClassName} = this.props

        return (
            <>
                {
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
                        <div className="swiper-pagination" ref={(el) => {
                            this.paginationRef = el
                        }}/>
                        {
                            showNavigation ? <>
                                <div className="swiper-button-prev"/>
                                <div className="swiper-button-next"/>
                            </> : null
                        }
                    </div>
                }
            </>

        )
    }
}
