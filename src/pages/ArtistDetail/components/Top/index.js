/**
 * 热门作品
 */
import {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Add from 'components/Add'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/music'
import {requestArtistTop} from 'services/artist'
import SongList from './components/SongList'

import './index.scss'

function Top(props) {
    const {artistId} = props

    const [loading, setLoading] = useState(false)
    const [songs, setSongs] = useState([])
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])


    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true)
                const res = await requestArtistTop({id: artistId})
                if (isMounted.current) {
                    setSongs(res?.songs || [])
                }
            } catch (e) {

            } finally {
                if (isMounted.current) {
                    setLoading(false)
                }
            }
        }

        fetchSongs()

    }, [artistId])

    return <>
        <div styleName="actions">
            <div className="fl">
                <Play type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
                    <a href={null} styleName="btn-play" title="播放"><i><em/>播放</i></a>
                </Play>
                <Add type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
                    <a href={null} styleName="btn-add-play" title="添加到播放列表"/>
                </Add>
            </div>
            <div className="fr"/>
        </div>
        <SongList loading={loading} songs={songs}/>
    </>
}

Top.propTypes = {
    artistId: PropTypes.number.isRequired,
}

export default Top
