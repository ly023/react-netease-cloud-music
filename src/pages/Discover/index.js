/**
 * 发现音乐-推荐
 */
import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import Page from 'components/Page'
import {requestHotCategory} from 'services/playlist'
import Banner from './components/Banner'
import NewestAlbum from './components/NewestAlbum'
import HotRcmd from './components/HotRcmd'
import PersonalizedRcmd from './components/PersonalizedRcmd'
import Rank from './components/Rank'
import Info from './components/Info'
import Singer from './components/Singer'
import Anchor from './components/Anchor'

import './index.scss'

@connect(({user}) => ({
    isLogin: user.isLogin,
}))
export default class Discover extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hotCategories: [],
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchHotCategory()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchHotCategory = async () => {
        const res = await requestHotCategory()
        if (this._isMounted) {
            const tags = res.tags || []
            if (tags.length) {
                this.setState({
                    hotCategories: tags.slice(0, 5)
                })
            }
        }
    }

    render() {
        const {hotCategories} = this.state
        const {isLogin} = this.props

        return (
            <Page>
                <Banner/>
                <div className='clearfix' styleName='main'>
                    <div styleName='left-wrapper'>
                        <div className='clearfix' styleName='left'>
                            {/* 热门推荐 */}
                            <section styleName='hot'>
                                <div styleName='title'>
                                    <Link className='fl' styleName='title-text' to=''>热门推荐</Link>
                                    <div className='fl' styleName='hot-tab'>
                                        {
                                            hotCategories.map((item, index) => {
                                                return <div key={index} styleName='hot-tab-item'>
                                                    <Link key={item.id} to={`/discover/playlist?cat=${item.name}`}>{item.name}</Link>
                                                    {index !== hotCategories.length - 1 ? <span>|</span> : null}
                                                </div>
                                            })
                                        }
                                    </div>
                                    <Link styleName='title-more' to='/discover/playlist'>更多<i/></Link>
                                </div>
                                <HotRcmd/>
                            </section>
                            {/* 个性化推荐 */}
                            {
                                isLogin ?  <section className='clearfix'>
                                    <div styleName='title'>
                                        <Link className='fl' styleName='title-text' to=''>个性化推荐</Link>
                                    </div>
                                    <PersonalizedRcmd/>
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
                        <Info/>
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
