import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import './index.scss'

export default class VersionModal extends React.Component {

    static propTypes = {
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
    }

    static defaultProps = {
        visible: false
    }

    render() {

        return (
            <Modal {...this.props} title="版本选择">
                <div styleName="linux">
                    <ul>
                        <li>
                            <a
                                href="http://d1.music.126.net/dmusic/netease-cloud-music_1.2.0_amd64_deepin_stable_20190424.deb"
                                target="_blank" hidefocus="true" title="Linux版下载">
                                deepin15（64位）
                            </a>
                            <a
                                href="http://d1.music.126.net/dmusic/netease-cloud-music_1.2.1_amd64_ubuntu_20190428.deb"
                                target="_blank" hidefocus="true" title="Linux版下载">
                                ubuntu18.04（64位）
                            </a>
                        </li>
                    </ul>
                </div>
            </Modal>
        )
    }
}
