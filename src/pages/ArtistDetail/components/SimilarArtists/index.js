/**
 * 相似歌手
 */
import {useEffect, useState, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import ListLoading from 'components/ListLoading'
import {requestSimilar} from 'services/artist'
import {getThumbnail} from 'utils'
import './index.scss'

function SimilarArtists(props) {
    const {artistId} = props
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])


    useEffect(() => {
        const fetchSimilarArtists = async () => {
            try {
                setLoading(true)
                const res = await requestSimilar({id: artistId})
                if (isMounted.current) {
                    const data = res?.artists || []
                    setArtists(data.slice(0, 12))
                }
            } catch (error) {
                console.log(error)
            }
            finally {
                if (isMounted.current) {
                    setLoading(false)
                }
            }
        }
        if (artistId) {
            fetchSimilarArtists()
        }
    }, [artistId])

    const renderItems = useMemo(() => {
        if (Array.isArray(artists)) {
            return artists.map((item) => {
                const {id, name, picUrl} = item
                return <li key={id} styleName="item">
                    <Link to={`/artist/${id}`} title={name}>
                        <img src={getThumbnail(picUrl, 50, 50)} styleName="avatar" alt=""/>
                        <p styleName="name">{name}</p>
                    </Link>
                </li>
            })
        }
    }, [artists])

    return artists?.length ? <>
        <h3 styleName="title">相似歌手</h3>
        <ListLoading loading={loading}/>
        <ul styleName="list">
            {renderItems}
        </ul>
    </> : null
}

SimilarArtists.propTypes = {
    artistId: PropTypes.number.isRequired,
}

export default SimilarArtists


