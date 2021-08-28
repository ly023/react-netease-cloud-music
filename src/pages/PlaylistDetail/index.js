/**
 * 歌单详情页
 */
import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Page from 'components/Page'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {requestRelated} from 'services/playlist'
import PlaylistDetail from 'components/PlaylistDetail'
import SubscribedUsers from 'components/SubscribedUsers'
import RelatedPlaylists from 'components/RelatedPlaylists'
import ClientDownload from 'components/ClientDownload'

import './index.scss'

@withRouter
export default class PlaylistDetailPage extends Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            detail: null,
            related: [],
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.setState(this.getInitialState())
            this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchData = () => {
        const {id} = this.props.match.params
        if (id) {
            this.fetchRelated(id)
        }
    }

    fetchRelated = async (id) => {
        const res = await requestRelated({id})
        if (this._isMounted) {
            this.setState({
                related: res.playlists || []
            })
        }
    }

    afterDetailLoaded = (detail) => {
        this.setState({
            detail: detail,
        })
    }

    render() {
        const {detail, related} = this.state

        const title = detail ? `${detail?.name || ''} - 歌单 - ${DEFAULT_DOCUMENT_TITLE}` : DEFAULT_DOCUMENT_TITLE

        const playlistId = Number(this.props.match?.params?.id)

        return (
            <Page title={title}>
                <div className="main">
                    <div className="left-wrapper">
                        <div className="left">
                            <PlaylistDetail id={playlistId} afterDetailLoaded={this.afterDetailLoaded}/>
                        </div>
                    </div>
                    <div className="right-wrapper">
                        <SubscribedUsers title="喜欢这个歌单的人" list={detail?.subscribers}/>
                        <RelatedPlaylists title="相关推荐" list={related}/>
                        <ClientDownload/>
                    </div>
                </div>
            </Page>
        )
    }
}
