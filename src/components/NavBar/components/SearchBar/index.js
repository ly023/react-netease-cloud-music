/**
 * 顶部搜索栏
 */
import Search from 'components/business/Search'

import './index.scss'

export default function SearchBar () {
    return <div styleName="wrapper">
        <Search
            type="navSearch"
            showSearchTip
        />
    </div>
}

