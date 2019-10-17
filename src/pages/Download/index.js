/**
 * 下载客户端
 */
import React from 'react'
import Page from 'components/Page'
import Popover from './components/Popover'
import VersionModal from './components/VersionModal'

import './index.scss'

const clients = [
    {
        type: 'aos',
        name: 'Android版',
        title: '安卓版下载',
        downLoadUrl: 'http://music.163.com/api/android/download/latest2',
    },
    {
        type: 'ios',
        name: 'iPhone版',
        title: 'iPhone版下载',
        downLoadUrl: 'https://itunes.apple.com/app/id590338362',
    },
    {
        type: 'ios',
        name: 'iPad版',
        title: 'iPad版下载',
        downLoadUrl: 'https://itunes.apple.com/cn/app/wang-yi-yun-yin-lehd/id871041757?l=ch',
    },
    {
        type: 'mac',
        name: 'Mac版',
        title: 'Mac版下载',
        downLoadUrl: 'https://music.163.com/api/osx/download/latest',
    },
    {
        type: 'pc',
        name: 'PC版',
        title: 'PC版下载',
        downLoadUrl: 'http://music.163.com/api/pc/download/latest',
    },
    {
        type: 'pc',
        name: 'UWP版',
        title: 'UWP版下载',
        downLoadUrl: 'https://www.microsoft.com/store/apps/9nblggh6g0jf',
    },
    {
        type: 'pc',
        name: 'WP版',
        title: 'WP版下载',
        downLoadUrl: 'https://www.microsoft.com/store/apps/9nblggh6g0jf',
    },
    {
        type: 'linux',
        name: 'Linux版',
        title: 'Linux版下载',
        downLoadUrl: null,
    }
]

export default class Download extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            linuxVersionVisible: false
        }
    }

    handleDownload = () => {
        const {platform} = window.navigator
        const isMac = platform.indexOf('Mac') > -1
        const isWindows = platform.indexOf('Win') > -1
        if (isMac) {
            window.location.href = 'https://music.163.com/api/osx/download/latest'
            return
        }
        if (isWindows) {
            window.location.href = 'https://music.163.com/api/pc/download/latest'
        }
    }

    handleDownloadLinux = () => {
        this.setState({
            linuxVersionVisible: true
        })
    }

    handleCancelVersionModal = () => {
        this.setState({
            linuxVersionVisible: false
        })
    }

    render() {
        const {linuxVersionVisible} = this.state

        return (
            <Page showBackTop={false}>
                <div styleName="banner-wrapper">
                    <div styleName="banner">
                        <div styleName="clients-wrapper" id="clients-wrapper">
                            <Popover
                                trigger="click"
                                placement="bottomRight"
                                getPopupContainer={() => document.getElementById('clients-wrapper')}
                                content={
                                    <div styleName="clients">
                                        {
                                            clients.map((item, index) => {
                                                return <a
                                                    key={index}
                                                    href={item.downLoadUrl}
                                                    styleName={`client client-${item.type}`}
                                                    target="_blank" title={item.title}
                                                    onClick={item.type === 'linux' ? this.handleDownloadLinux : () => {
                                                    }}
                                                >
                                                    <i/>
                                                    <em>{item.name}</em>
                                                </a>
                                            })
                                        }
                                    </div>
                                }
                            >
                                <div styleName="download">
                                    <i styleName="icon-download"/>下载全部客户端
                                </div>
                            </Popover>
                        </div>
                        <div styleName="pc">
                            <div styleName="banner-title">在电脑上听</div>
                            <img src={require('./images/pc-client.jpeg')} alt=""/>
                            <div styleName="type">
                                <span><i styleName="icon icon-mac"/>macOS</span>
                                <span><i styleName="icon icon-win"/>Windows</span>
                            </div>
                            <div styleName="download-btn" onClick={this.handleDownload}>下载电脑端</div>
                        </div>
                        <div styleName="mobile">
                            <div styleName="banner-title">在手机上听</div>
                            <img src={require('./images/mobile-client.jpeg')} alt=""/>
                            <div styleName="type">
                                <span><i styleName="icon icon-ios"/>iPhone</span>
                                <span><i styleName="icon icon-android"/>Android</span>
                            </div>
                            <div styleName="mobile-download" id="mobile-download">
                                <Popover
                                    trigger="click"
                                    placement="top"
                                    getPopupContainer={() => document.getElementById('mobile-download')}
                                    content={<div styleName="mobile-code">
                                        <img src={require("./images/code.png")}/>
                                        <p>扫描二维码下载</p>
                                    </div>}
                                >
                                    <div styleName="download-btn"><i styleName="code-icon"/>下载手机端</div>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
                <div styleName="cont cont-1">
                    <div className="clearfix" styleName="wrapper">
                        <div className="fl">
                            <h3 styleName="title">千万曲库 首首CD音质</h3>
                            <p styleName="des">
                                囊括百万无损SQ音乐，你在用手机听歌时，
                            </p>
                            <p styleName="des">
                                也能感受到纤毫毕现的CD音质，更能免费离线收听
                            </p>
                        </div>
                        <div className="fr">
                            <img useMap="#testtool" src={require("./images/b1.jpg")} alt="千万曲库 首首CD音质"/>
                            <map name="testtool">
                                <area
                                    style={{cursor: "default"}}
                                    shape="rect"
                                    coords="80,150,145,173"
                                    hidefocus="true"
                                    href="http://s1.music.126.net/download/pc/CloudMusicDetectionV7.exe"/>
                            </map>
                        </div>
                    </div>
                </div>
                <div styleName="cont cont-2">
                    <div className="clearfix" styleName="wrapper">
                        <div className="fl"><img src={require("./images/b2.jpg")} alt="千位明星 亲自推荐音乐"/>
                        </div>
                        <div className="fr">
                            <h3 styleName="title">千位明星 亲自推荐音乐</h3>
                            <p styleName="des">陶喆，羽泉等<em>千位明星已入驻</em>，亲自创建私房歌单，录制独</p>
                            <p styleName="des">家DJ节目，推荐他们心中的好音乐</p>
                        </div>
                    </div>
                </div>
                <div styleName="cont cont-3">
                    <div className="clearfix" styleName="wrapper">
                        <div className="fl">
                            <h3 styleName="title">社交关系 发现全新音乐</h3>
                            <p styleName="des">你可以<em>关注明星</em>、DJ和好友，通过浏览他们的动态、收藏和</p>
                            <p styleName="des">分享，发现更多全新好音乐</p>
                        </div>
                        <div className="fr">
                            <img src={require("./images/b3.jpg")} alt="社交关系 发现全新音乐"/>
                        </div>
                    </div>
                </div>
                <div styleName="cont cont-4">
                    <div className="clearfix" styleName="wrapper">
                        <div className="fl">
                            <img src={require("./images/b4.jpg")} alt="手机电脑 歌单实时同步"/>
                        </div>
                        <div className="fr">
                            <h3 styleName="title">手机电脑 歌单实时同步</h3>
                            <p styleName="des">只要一个帐号，你就可以同步在手机、电脑上创建、收藏</p>
                            <p styleName="des">的歌单，<em>随时随地畅享好音乐</em></p>
                        </div>
                    </div>
                </div>
                <div styleName="cont cont-5">
                    <div className="clearfix" styleName="wrapper">
                        <div className="fl">
                            <h3 styleName="title">听歌识曲 助你疯狂猜歌</h3>
                            <p styleName="des">
                                歌曲很动听却不知道歌名，歌名在嘴边却想不起来……
                            </p>
                            <p styleName="des">用<em>听歌识曲</em>功能，几秒钟就知道歌名</p>
                        </div>
                        <div className="fr">
                            <img src={require("./images/b5.jpg")} alt="听歌识曲 助你疯狂猜歌"/>
                        </div>
                    </div>
                </div>
                <div styleName="code">
                    <img src={require("./images/code.png")}/>
                    <p>扫描二维码下载</p>
                </div>
                <VersionModal visible={linuxVersionVisible} onCancel={this.handleCancelVersionModal}/>
            </Page>
        )
    }
}
