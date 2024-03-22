import styles from './index.scss'

export default function ClientDownload() {
  return (
      <div className={styles['multiple-client']}>
        <h3 className={styles.title}>网易云音乐多端下载</h3>
        <ul className={styles.bg}>
          <li>
            <a
                href="https://itunes.apple.com/cn/app/id590338362"
                target="_blank"
                rel="noreferrer"
                className={styles.ios}
            >
              iPhone
            </a>
          </li>
          <li>
            <a
                href="https://music.163.com/api/pc/download/latest"
                target="_blank"
                rel="noreferrer"
                className={styles.pc}
            >
              PC
            </a>
          </li>
          <li>
            <a
                href="https://music.163.com/api/android/download/latest2"
                target="_blank"
                rel="noreferrer"
                className={styles.aos}
            >
              Android
            </a>
          </li>
        </ul>
        <p className={styles.tip}>同步歌单，随时畅听320k好音乐</p>
      </div>
  )
}
