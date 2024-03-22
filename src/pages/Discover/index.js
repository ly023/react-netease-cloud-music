/**
 * 发现音乐-推荐
 */
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Page from 'components/Page'
import { requestHotCategory } from 'services/playlist'
import Banner from './components/Banner'
import NewestAlbum from './components/NewestAlbum'
import HotRcmd from './components/HotRcmd'
import PersonalizedRcmd from './components/PersonalizedRcmd'
import Rank from './components/Rank'
import Info from './components/Info'
import Singer from './components/Singer'
import styles from './index.scss'

@connect(({ user }) => ({
  isLogin: user.isLogin
}))
export default class Discover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hotCategories: []
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
    const { hotCategories } = this.state
    const { isLogin } = this.props

    return (
      <Page>
        <Banner />
        <div className={`clearfix ${styles.main}`}>
          <div className={styles['left-wrapper']}>
            <div className={`clearfix ${styles.left}`}>
              {/* 热门推荐 */}
              <section className={styles.hot}>
                <div className={styles.title}>
                  <div className={styles.titleMain}>
                    <RadioButtonCheckedOutlinedIcon
                      className={`fl ${styles.icon}`}
                    />
                    <Link className={`fl ${styles['title-text']}`} to="">
                      热门推荐
                    </Link>
                    <div className={`fl ${styles['hot-tab']}`}>
                      {hotCategories.map((item, index) => {
                        return (
                          <div key={index} className={styles['hot-tab-item']}>
                            <Link
                              key={item.id}
                              to={`/discover/playlist?cat=${item.name}`}
                            >
                              {item.name}
                            </Link>
                            {index !== hotCategories.length - 1 ? (
                              <span>|</span>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <Link
                    className={styles['title-more']}
                    to="/discover/playlist"
                  >
                    更多
                    <ArrowForwardIcon className={styles['more-icon']} />
                  </Link>
                </div>
                <HotRcmd />
              </section>
              {/* 个性化推荐 */}
              {isLogin ? (
                <section className="clearfix">
                  <div className={styles.title}>
                    <div className={styles['title-main']}>
                      <RadioButtonCheckedOutlinedIcon
                        className={`fl ${styles.icon}`}
                      />
                      <Link
                        className={`fl ${styles['title-text']}`}
                        to="/discover/recommend/daily"
                      >
                        个性化推荐
                      </Link>
                    </div>
                  </div>
                  <PersonalizedRcmd />
                </section>
              ) : null}
              {/* 新碟上架 */}
              <section className="clearfix">
                <div className={styles.title}>
                  <div className={styles['title-main']}>
                    <RadioButtonCheckedOutlinedIcon className={styles.icon} />
                    <Link
                      className={`fl ${styles['title-text']}`}
                      to="/discover/album"
                    >
                      新碟上架
                    </Link>
                  </div>
                  <Link className={styles['title-more']} to="/discover/album">
                    更多
                    <ArrowForwardIcon className={styles['more-icon']} />
                  </Link>
                </div>
                <NewestAlbum />
              </section>
              {/* 榜单 */}
              <section>
                <div className={styles.title}>
                  <div className={styles['title-main']}>
                    <RadioButtonCheckedOutlinedIcon className={styles.icon} />
                    <Link
                      className={`fl ${styles['title-text']}`}
                      to="/discover/toplist"
                    >
                      榜单
                    </Link>
                  </div>
                  <Link
                    className={`${styles['title-more']} ${styles['more-icon']}`}
                    to="/discover/toplist"
                  >
                    更多
                    <ArrowForwardIcon />
                  </Link>
                </div>
                <Rank />
              </section>
            </div>
          </div>
          <div className={styles['right-wrapper']}>
            {/* 个人信息 */}
            <Info />
            {/* 入驻歌手 */}
            <Singer />
          </div>
        </div>
      </Page>
    )
  }
}
