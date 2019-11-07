import React from 'react'
import {Link} from 'react-router-dom'
import {requestArtist} from 'services/artist'

import './index.scss'

export default class Singer extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            artists: []
        }

        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchArtist()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchArtist = async () => {
        const params = {limit: 5, cat: 5001} // 5001：入驻歌手
        const res = await requestArtist(params)
        if(this._isMounted){
            this.setState({
                artists: res.artists
            })
        }
    }

    render() {
        const {artists}= this.state

        return (
            <section styleName="wrapper">
                <h3 styleName="title">
                    <span className="fl">入驻歌手</span>
                    <a href={null} styleName="more">查看全部 ></a>
                </h3>
                <ul styleName="list">
                    {
                        artists.map((item) => {
                            return <li key={item.accountId} styleName="item">
                                <Link to={`/user/home/${item.accountId}`}>
                                    <img src={item.picUrl} styleName="item-avatar" alt="头像"/>
                                    <div styleName="item-info">
                                        <h4 styleName="item-nickname">{item.name}{item.alias?.[0]}</h4>
                                        <p styleName="item-desc">暂无描述</p>
                                    </div>
                                </Link>
                            </li>
                        })
                    }
                </ul>
                <a href={null} styleName="apply">
                    <i>申请成为网易云音乐人</i>
                </a>
            </section>
        )
    }
}
