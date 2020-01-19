/**
 * 节目排行榜
 */
import React, {useState, useMemo} from 'react'
import moment from 'moment'
moment.locale('zh-cn')
import Page from 'components/Page'
import ProgramRank from 'components/ProgramRank'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'

import './index.scss'

const ProgramRankPage = () => {
    const [updateTime, setUpdateTime] = useState(0)

    const onLoad = (data) => {
        if (data && data.updateTime) {
            setUpdateTime(data.updateTime)
        }
    }

    const title = useMemo(() => `节目排行榜 - 主播电台 - ${DEFAULT_DOCUMENT_TITLE}`, [])

    return <Page title={title}>
        <div className="main">
            <div styleName="gutter">
                <div styleName="title">
                    <h3>节目排行榜</h3>
                    {updateTime ? <span styleName="sub">最近更新：{moment(updateTime).format('MM月Do')}</span> : null}
                </div>
                <ProgramRank type="full" onLoad={onLoad}/>
            </div>
        </div>
    </Page>
}

export default ProgramRankPage
