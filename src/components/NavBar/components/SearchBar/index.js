/**
 * 顶部搜索栏
 */
import React from 'react'
import Search from 'components/Search'

import './index.scss'

export default function SearchBar () {
    return <div styleName="wrapper">
        <Search
            type="navSearch"
            showSearchTip
        />
    </div>
}

