/**
 *  下载
 */
import React from 'react'
import PropTypes from 'prop-types'
import {requestResource} from 'services/song'

function Download(props) {
    const {id} = props

    const fetchSongUrl = (id) => {
        requestResource({id})
            .then((res) => {
                if (res && res.code === 200) {
                    const song = res.data?.[0] || {}
                    const url = song.url
                    if (url) {
                        window.open(url)
                    }
                }
            })
    }

    const handleDownload = (e) => {
        e.stopPropagation()
        fetchSongUrl(id)
    }

    const {children} = props
    const onlyChildren = React.Children.only(children)

    return (
        React.cloneElement(onlyChildren, {
            onClick: handleDownload
        })
    )
}

Download.propTypes = {
    id: PropTypes.number.isRequired,
}

export default Download
