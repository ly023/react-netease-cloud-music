import React from 'react'
import {Link} from 'react-router-dom'
import './index.scss'
import {requestArtist} from "services/artist";

export default class Singer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            artists: []
        }

        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        this.fetchArtist()
    }

    componentWillUnmount() {
        this.mounted = false
    }

    fetchArtist = () => {
        const params = {limit: 5, cat: 5001} // 5001：入驻歌手
        requestArtist(params).then((res) => {
            this.setState({
                artists: res.artists
            })
        })
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
