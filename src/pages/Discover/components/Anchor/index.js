/**
 * 热门主播
 */
import {useState, useEffect, useRef, memo} from 'react'
import {Link} from 'react-router-dom'
import {requestHotAnchorMock} from 'services/radio'
import staticHotAnchorJson from 'assets/json/static-hot-anchor'
import {getThumbnail} from 'utils'

import './index.scss'

function Anchor() {
    const [anchors, setAnchors] = useState([])
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        const fetchHotAnchor = async () => {
            try {
                const res = await requestHotAnchorMock()
                if (isMounted.current) {
                    setAnchors(res?.data || [])
                }
            } catch (e) {
                if (isMounted.current) {
                    setAnchors(staticHotAnchorJson.data)
                }
            }
        }

        fetchHotAnchor()

        return () => {
            isMounted.current = false
        }
    }, [])

    return <section styleName="wrapper">
        <div styleName="title">热门主播</div>
        <ul styleName="list">
            {
                anchors.map((item) => {
                    const {user} = item
                    const homeLink = `/user/home/${user.id}`
                    return <li key={user.id} styleName="item">
                        <Link to={homeLink} styleName="cover">
                            <img
                                src={getThumbnail(item.picUrl, 40)}
                                alt=""
                            />
                        </Link>
                        <div styleName="info">
                            <p styleName="name">
                                <Link to={homeLink}>{user.name}</Link>
                                <sup/>
                            </p>
                            <p styleName="desc">{item.desc}</p>
                        </div>
                    </li>
                })
            }
        </ul>
    </section>
}

export default memo(Anchor)
