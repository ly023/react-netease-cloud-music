import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { click } from 'utils'
import { EMOJI, EMOJI_PREFIX_URL } from '../../constants'

import styles from './index.scss'

const LIMIT = 50
const DOM_ID = 'emoji-panel'

export default class EmojiPanel extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    onChange: PropTypes.func,
    onCancel: PropTypes.func
  }

  static defaultProps = {
    visible: false
  }

  constructor(props) {
    super(props)
    this.state = {
      emojiList: [],
      offset: 0,
      total: 0
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick)

    let emojiList = []
    EMOJI.forEach((emojiId, emojiText) => {
      emojiList.push(
        <span
          key={emojiId}
          className={styles.item}
          title={emojiText}
          onClick={() => this.handleSelect(emojiText)}
        >
          <img src={EMOJI_PREFIX_URL.replace('{id}', emojiId)} alt="" />
        </span>
      )
    })
    this.setState({
      emojiList,
      total: emojiList.length
    })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
  }

  handleDocumentClick = (e) => {
    click(e, DOM_ID, this.props.onCancel)
  }

  handleSelect = (emojiText) => {
    const { onChange } = this.props
    onChange && onChange(`[${emojiText}]`)
  }

  handlePrev = () => {
    this.setState((prevState) => {
      return {
        offset: prevState.offset - LIMIT
      }
    })
  }

  handleNext = () => {
    this.setState((prevState) => {
      return {
        offset: prevState.offset + LIMIT
      }
    })
  }

  getRenderEmojiList = (offset) => {
    return this.state.emojiList.slice(offset, offset + LIMIT)
  }

  render() {
    const { visible } = this.props
    const { offset, total } = this.state
    const prevDisabled = offset === 0
    const nextDisabled = offset >= total - LIMIT

    return (
      <div id={DOM_ID} className={`${styles.wrapper} ${visible ? '' : 'hide'}`}>
        <div className={styles.list}>{this.getRenderEmojiList(offset)}</div>
        <div className={styles.pagination}>
          <span
            className={`${styles.prev} ${prevDisabled ? styles.disabled : ''}`}
            onClick={prevDisabled ? () => {} : this.handlePrev}
          />
          <em>
            {offset / LIMIT + 1}/{Math.ceil(total / LIMIT)}
          </em>
          <span
            className={`${styles.next} ${nextDisabled ? styles.disabled : ''}`}
            onClick={nextDisabled ? () => {} : this.handleNext}
          />
        </div>
      </div>
    )
  }
}
