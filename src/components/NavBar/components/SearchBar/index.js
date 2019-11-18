/**
 * 顶部搜索栏
 */
import React from 'react'
import Search from 'components/Search'

import './index.scss'

export default function SearchBar () {
    return <div styleName="wrapper">
        <Search
            wrapperId="nav-search-bar"
            showSearchTip
            inputWrapper={<div styleName="search-bar"/>}
            input={
                <input
                    placeholder="音乐/视频/电台/用户"
                    styleName="input"
                />
            }
            resultWrapper={<div styleName="layout"/>}
        />
    </div>
}

