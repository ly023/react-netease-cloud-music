/**
 *  下载
 */
import { cloneElement, Children } from 'react'
import PropTypes from 'prop-types'
import { requestResource } from 'services/song'

function Download(props) {
  const { id } = props

  const fetchSongUrl = (id) => {
    requestResource({ id }).then((res) => {
      const song = res.data?.[0] || {}
      const url = song.url
      if (url) {
        window.open(url)
      }
    })
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    fetchSongUrl(id)
  }

  const { children } = props
  const onlyChildren = Children.only(children)

  return cloneElement(onlyChildren, {
    onClick: handleDownload
  })
}

Download.propTypes = {
  id: PropTypes.number.isRequired
}

export default Download
