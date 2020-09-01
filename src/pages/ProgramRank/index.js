/**
 * 节目排行榜
 */
import React, {useState, useMemo} from 'react'
import dayjs from 'dayjs'
import Page from 'components/Page'
import ProgramRank from 'components/ProgramRank'
import QuestionPopover from 'components/Popover/QuestionPopover'
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

    const tip = useMemo(() => '选取云音乐中7天内发布的热度最高的节目，每天更新。热度由节目播放、赞、分享数量总和计算。', [])

    return <Page title={title}>
        <div className="main">
            <div styleName="gutter">
                <div styleName="title">
                    <h3>节目排行榜</h3>
                    {updateTime ? <span styleName="sub">最近更新：{dayjs(updateTime).format('MM月DD日')}</span> : null}
                    <div styleName="question">
                        <QuestionPopover
                            placement="bottomRight"
                            trigger="hover"
                            style={{width: 300}}
                            content={tip}
                        />
                    </div>
                </div>
                <ProgramRank type="full" onLoad={onLoad}/>
            </div>
        </div>
    </Page>
}

export default ProgramRankPage
