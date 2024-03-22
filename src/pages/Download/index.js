/**
 * 下载客户端
 */
import { Component } from 'react'
import Page from 'components/Page'
import Popover from './components/Popover'
import VersionModal from './components/VersionModal'
import pcImage from './images/pc-client.jpeg'
import mobileImage from './images/mobile-client.jpeg'
import codeImage from './images/code.png'
import bg1Image from './images/b1.jpg'
import bg2Image from './images/b2.jpg'
import bg3Image from './images/b3.jpg'
import bg4Image from './images/b4.jpg'
import bg5Image from './images/b5.jpg'

import styles from './index.scss'

const clients = [
  {
    type: 'aos',
    name: 'Android版',
    title: '安卓版下载',
    downLoadUrl: 'http://music.163.com/api/android/download/latest2'
  },
  {
    type: 'ios',
    name: 'iPhone版',
    title: 'iPhone版下载',
    downLoadUrl: 'https://itunes.apple.com/app/id590338362'
  },
  {
    type: 'ios',
    name: 'iPad版',
    title: 'iPad版下载',
    downLoadUrl:
      'https://itunes.apple.com/cn/app/wang-yi-yun-yin-lehd/id871041757?l=ch'
  },
  {
    type: 'mac',
    name: 'Mac版',
    title: 'Mac版下载',
    downLoadUrl: 'https://music.163.com/api/osx/download/latest'
  },
  {
    type: 'pc',
    name: 'PC版',
    title: 'PC版下载',
    downLoadUrl: 'http://music.163.com/api/pc/download/latest'
  },
  {
    type: 'pc',
    name: 'UWP版',
    title: 'UWP版下载',
    downLoadUrl: 'https://www.microsoft.com/store/apps/9nblggh6g0jf'
  },
  {
    type: 'pc',
    name: 'WP版',
    title: 'WP版下载',
    downLoadUrl: 'https://www.microsoft.com/store/apps/9nblggh6g0jf'
  },
  {
    type: 'linux',
    name: 'Linux版',
    title: 'Linux版下载',
    downLoadUrl: null
  }
]

export default class Download extends Component {
  constructor(props) {
    super(props)
    this.state = {
      linuxVersionVisible: false
    }
  }

  handleDownload = () => {
    const { platform } = window.navigator
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
    const { linuxVersionVisible } = this.state

    return (
      <Page
        title="下载网易云音乐iPhone、iPad、Mac、Android、WP、PC版客户端"
        showBackTop={false}
      >
        <div className={styles['banner-wrapper']}>
          <div className={styles['banner']}>
            <div className={styles['clients-wrapper']} id="clients-wrapper">
              <Popover
                trigger="click"
                placement="bottomRight"
                getPopupContainer={() =>
                  document.getElementById('clients-wrapper')
                }
                content={
                  <div className={styles.clients}>
                    {clients.map((item, index) => {
                      return (
                        <a
                          key={index}
                          href={item.downLoadUrl}
                          className={`${styles.client} ${styles[`client-${item.type}`]}`}
                          target="_blank"
                          title={item.title}
                          onClick={
                            item.type === 'linux'
                              ? this.handleDownloadLinux
                              : () => {}
                          }
                          rel="noreferrer"
                        >
                          <i />
                          <em>{item.name}</em>
                        </a>
                      )
                    })}
                  </div>
                }
              >
                <div className={styles.download}>
                  <i className={styles['icon-download']} />
                  下载全部客户端
                </div>
              </Popover>
            </div>
            <div className={styles.pc}>
              <div className={styles['banner-title']}>在电脑上听</div>
              <img src={pcImage} alt="" />
              <div className={styles.type}>
                <span>
                  <i className={`${styles.icon} ${styles['icon-mac']}`} />
                  macOS
                </span>
                <span>
                  <i className={`${styles.icon} ${styles['icon-win']}`} />
                  Windows
                </span>
              </div>
              <div
                className={styles['download-btn']}
                onClick={this.handleDownload}
              >
                下载电脑端
              </div>
            </div>
            <div className={styles.mobile}>
              <div className={styles['banner-title']}>在手机上听</div>
              <img src={mobileImage} alt="" />
              <div className={styles.type}>
                <span>
                  <i className={`${styles.icon} ${styles['icon-ios']}`} />
                  iPhone
                </span>
                <span>
                  <i className={`${styles.icon} ${styles['icon-android']}`} />
                  Android
                </span>
              </div>
              <div className={styles['mobile-download']} id="mobile-download">
                <Popover
                  trigger="click"
                  placement="top"
                  getPopupContainer={() =>
                    document.getElementById('mobile-download')
                  }
                  content={
                    <div className={styles['mobile-code']}>
                      <img src={codeImage} alt="" />
                      <p>扫描二维码下载</p>
                    </div>
                  }
                >
                  <div className={styles['download-btn']}>
                    <i className={styles['code-icon']} />
                    下载手机端
                  </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.cont} ${styles['cont-1']}`}>
          <div className={`clearfix ${styles.wrapper}`}>
            <div className="fl">
              <h3 className={styles.title}>千万曲库 首首CD音质</h3>
              <p className={styles.des}>
                囊括百万无损SQ音乐，你在用手机听歌时，
              </p>
              <p className={styles.des}>
                也能感受到纤毫毕现的CD音质，更能免费离线收听
              </p>
            </div>
            <div className="fr">
              <img
                useMap="#testtool"
                src={bg1Image}
                alt="千万曲库 首首CD音质"
              />
              <map name="testtool">
                <area
                  style={{ cursor: 'default' }}
                  shape="rect"
                  coords="80,150,145,173"
                  href="http://s1.music.126.net/download/pc/CloudMusicDetectionV7.exe"
                />
              </map>
            </div>
          </div>
        </div>
        <div className={`${styles.cont} ${styles['cont-2']}`}>
          <div className={`clearfix ${styles.wrapper}`}>
            <div className="fl">
              <img src={bg2Image} alt="千位明星 亲自推荐音乐" />
            </div>
            <div className="fr">
              <h3 className={styles.title}>千位明星 亲自推荐音乐</h3>
              <p className={styles.des}>
                陶喆，羽泉等<em>千位明星已入驻</em>，亲自创建私房歌单，录制独
              </p>
              <p className={styles.des}>家DJ节目，推荐他们心中的好音乐</p>
            </div>
          </div>
        </div>
        <div className={`${styles.cont} ${styles['cont-3']}`}>
          <div className={`clearfix ${styles.wrapper}`}>
            <div className="fl">
              <h3 className={styles.title}>社交关系 发现全新音乐</h3>
              <p className={styles.des}>
                你可以<em>关注明星</em>、DJ和好友，通过浏览他们的动态、收藏和
              </p>
              <p className={styles.des}>分享，发现更多全新好音乐</p>
            </div>
            <div className="fr">
              <img src={bg3Image} alt="社交关系 发现全新音乐" />
            </div>
          </div>
        </div>
        <div className={`${styles.cont} ${styles['cont-4']}`}>
          <div className={`clearfix ${styles.wrapper}`}>
            <div className="fl">
              <img src={bg4Image} alt="手机电脑 歌单实时同步" />
            </div>
            <div className="fr">
              <h3 className={styles.title}>手机电脑 歌单实时同步</h3>
              <p className={styles.des}>
                只要一个帐号，你就可以同步在手机、电脑上创建、收藏
              </p>
              <p className={styles.des}>
                的歌单，<em>随时随地畅享好音乐</em>
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.cont} ${styles['cont-5']}`}>
          <div className={`clearfix ${styles.wrapper}`}>
            <div className="fl">
              <h3 className={styles.title}>听歌识曲 助你疯狂猜歌</h3>
              <p className={styles.des}>
                歌曲很动听却不知道歌名，歌名在嘴边却想不起来……
              </p>
              <p className={styles.des}>
                用<em>听歌识曲</em>功能，几秒钟就知道歌名
              </p>
            </div>
            <div className="fr">
              <img src={bg5Image} alt="听歌识曲 助你疯狂猜歌" />
            </div>
          </div>
        </div>
        <div className={styles.code}>
          <img src={codeImage} alt="" />
          <p>扫描二维码下载</p>
        </div>
        <VersionModal
          visible={linuxVersionVisible}
          onCancel={this.handleCancelVersionModal}
        />
      </Page>
    )
  }
}
