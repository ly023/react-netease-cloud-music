/**
 * 发现音乐-推荐
 */
import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import Page from 'components/Page'
import CustomSwiper from 'components/CustomSwiper'
import {requestDiscoverBanners} from 'services/banners'
import {requestHotCategory} from 'services/playlist'
import NewestAlbum from './components/NewestAlbum'
import HotRcmd from './components/HotRcmd'
import PersonalizedRcmd from './components/PersonalizedRcmd'
import Rank from './components/Rank'
import Info from './components/Info'
import Singer from './components/Singer'
import Anchor from './components/Anchor'

import styles from './index.scss'

@connect(({user}) => ({
    user,
}))
export default class Discover extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            banners: [],
            hotCategory: [],
            personalized: [],
            artists: []
        }
    }

    componentDidMount() {
        this.fetchBanners()
        this.fetchHotCategory()
    }

    fetchBanners = () => {
        requestDiscoverBanners().then((res) => {
            this.setState({
                banners: res.banners.map((v) => {
                    // todo 不同类型轮播图
                    if(v.targetType === 1) {
                        return <a style={{display: 'inline-block'}} href={`/song/${v.targetId}`}>
                            <img src={v.imageUrl} alt=""/>
                        </a>
                    }
                    return <img src={v.imageUrl} alt=""/>
                })
            })
        })
    }

    fetchHotCategory = () => {
        requestHotCategory().then((res) => {
            const tags = res.tags || []
            if (tags.length) {
                this.setState({
                    hotCategory: tags.slice(0, 5)
                })
            }
        })
    }

    render() {
        const {banners, hotCategory} = this.state
        const userId = this.props.user?.userInfo?.profile?.userId

        return (
            <Page>
                <section styleName='banner-wrapper'>
                    <div styleName='banner'>
                        <CustomSwiper
                            slides={banners}
                            showNavigation={true}
                            containerClassName={styles['banner-container']}/>
                        <div styleName='download'>
                            <Link to='/download' hidefocus='true'>下载客户端</Link>
                            <p>PC 安卓 iPhone WP iPad Mac 六大客户端</p>
                            <span styleName='shadow-left'/>
                            <span styleName='shadow-right'/>
                        </div>
                    </div>
                </section>
                <div className='clearfix' styleName='main'>
                    <div styleName='left-wrapper'>
                        <div className='clearfix' styleName='left'>
                            {/* 热门推荐 */}
                            <section styleName='hot'>
                                <div styleName='title'>
                                    <Link className='fl' styleName='title-text' to=''>热门推荐</Link>
                                    <div className='fl' styleName='hot-tab'>
                                        {
                                            hotCategory.map((item, index) => {
                                                return <div key={index} styleName='hot-tab-item'>
                                                    <Link key={item.id} to={`/discover/playlist?cat=${item.name}`}>{item.name}</Link>
                                                    {index !== hotCategory.length - 1 ? <span>|</span> : null}
                                                </div>
                                            })
                                        }
                                    </div>
                                    <Link styleName='title-more' to=''>更多<i/></Link>
                                </div>
                                <HotRcmd/>
                            </section>
                            {/* 个性化推荐 */}
                            {
                                userId ?  <section className='clearfix'>
                                    <div styleName='title'>
                                        <Link className='fl' styleName='title-text' to=''>个性化推荐</Link>
                                    </div>
                                    <PersonalizedRcmd userId={userId}/>
                                </section> : null
                            }
                            {/* 新碟上架 */}
                            <section className="clearfix">
                                <div styleName="title">
                                    <Link className="fl" styleName="title-text" to=''>新碟上架</Link>
                                    <Link styleName="title-more" to=''>更多<i/></Link>
                                </div>
                                <NewestAlbum/>
                            </section>
                            {/* 榜单 */}
                            <section>
                                <div styleName='title'>
                                    <Link className='fl' styleName='title-text' to=''>榜单</Link>
                                    <Link styleName='title-more' to=''>更多<i/></Link>
                                </div>
                                <Rank/>
                            </section>
                        </div>
                    </div>
                    <div styleName='right-wrapper'>
                        {/* 个人信息 */}
                        <Info userId={userId}/>
                        {/* 入驻歌手 */}
                        <Singer/>
                        {/* 热门主播 */}
                        <Anchor/>
                    </div>
                </div>
            </Page>
        )
    }
}
