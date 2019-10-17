/**
 * 热门主播
 */
import React from 'react'
import {Link} from 'react-router-dom'
import './index.scss'

export default class Anchor extends React.PureComponent {
    // todo
    render() {
        return (
            <section styleName="wrapper">
                <div styleName="title">热门主播</div>
                <ul styleName="list">
                    <li styleName="item">
                        <Link to="/user/home/278438485" styleName="cover">
                            <img
                                src="http://p2.music.126.net/H3QxWdf0eUiwmhJvA4vrMQ==/1407374893913311.jpg?param=40y40"
                                alt="封面"
                            />
                        </Link>
                        <div styleName="info">
                            <p styleName="name">
                                <Link to="/user/home/278438485">陈立</Link>
                                <sup/>
                            </p>
                            <p styleName="desc">心理学家、美食家陈立教授</p>
                        </div>
                    </li>
                    <li styleName="item">
                        <Link to="/user/home/91239965" styleName="cover">
                            <img
                                src="http://p2.music.126.net/y5-sM7tjnxnu_V9LWKgZlw==/7942872001461517.jpg?param=40y40"
                                alt="封面"
                            />
                        </Link>
                        <div styleName="info">
                            <p styleName="name">
                                <Link to="/user/home/91239965">DJ艳秋</Link>
                                <sup/>
                            </p>
                            <p styleName="desc">著名音乐节目主持人</p>
                        </div>
                    </li>
                    <li styleName="item">
                        <Link to="/user/home/324314596" styleName="cover">
                            <img
                                src="http://p2.music.126.net/6cc6lgOfQTo6ovNnTHPyJg==/3427177769086282.jpg?param=40y40"
                                alt="封面"
                            />
                        </Link>
                        <div styleName="info">
                            <p styleName="name">
                                <Link to="/user/home/324314596">国家大剧院古典音乐频道</Link>
                                <sup/>
                            </p>
                            <p styleName="desc">国家大剧院古典音乐官方</p>
                        </div>
                    </li>
                    <li styleName="item">
                        <Link to="/user/home/1611157" styleName="cover">
                            <img
                                src="http://p2.music.126.net/xa1Uxrrn4J0pm_PJwkGYvw==/3130309604335651.jpg?param=40y40"
                                alt="封面"
                            />
                        </Link>
                        <div styleName="info">
                            <p styleName="name">
                                <Link to="/user/home/1611157">谢谢收听</Link>
                                <sup/>
                            </p>
                            <p styleName="desc">南京电台主持人王馨</p>
                        </div>
                    </li>
                    <li styleName="item">
                        <Link to="/user/home/2313954" styleName="cover">
                            <img
                                src="http://p2.music.126.net/slpd09Tf5Ju82Mv-h8MP4w==/3440371884651965.jpg?param=40y40"
                                alt="封面"
                            />
                        </Link>
                        <div styleName="info">
                            <p styleName="name">
                                <Link to="/user/home/2313954">DJ晓苏</Link>
                                <sup/>
                            </p>
                            <p styleName="desc">独立DJ，CRI环球旅游广播特邀DJ</p>
                        </div>
                    </li>
                </ul>
            </section>
        )
    }

}
