/**
 * 歌单详情页
 */
import { Component } from 'react'
import withRouter from 'hoc/withRouter'
import Page from 'components/Page'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import { requestRelated } from 'services/playlist'
import PlaylistDetail from 'components/business/PlaylistDetail'
import SubscribedUsers from 'components/business/SubscribedUsers'
import RelatedPlaylists from 'components/business/RelatedPlaylists'

@withRouter
export default class PlaylistDetailPage extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      detail: null,
      related: []
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.setState(this.getInitialState())
      this.fetchData()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchData = () => {
    const { id } = this.props.params
    if (id) {
      this.fetchRelated(id)
    }
  }

  fetchRelated = async (id) => {
    const res = await requestRelated({ id })
    if (this._isMounted) {
      this.setState({
        related: res.playlists || []
      })
    }
  }

  afterDetailLoaded = (detail) => {
    this.setState({
      detail: detail
    })
  }

  render() {
    const { detail, related } = this.state

    const title = detail
      ? `${detail?.name || ''} - 歌单 - ${DEFAULT_DOCUMENT_TITLE}`
      : DEFAULT_DOCUMENT_TITLE

    const playlistId = Number(this.props.params?.id)

    return (
      <Page title={title}>
        <div className="main">
          <div className="left-wrapper">
            <div className="left">
              <PlaylistDetail
                id={playlistId}
                afterDetailLoaded={this.afterDetailLoaded}
              />
            </div>
          </div>
          <div className="right-wrapper">
            <SubscribedUsers
              title="喜欢这个歌单的人"
              list={detail?.subscribers}
            />
            <RelatedPlaylists title="相关推荐" list={related} />
          </div>
        </div>
      </Page>
    )
  }
}
