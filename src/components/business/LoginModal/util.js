export function setAuthCooKie(cookieStr) {
  if (cookieStr && typeof cookieStr === 'string') {
    const reg = /;(?!\s)/g
    const cookies = cookieStr.split(reg).filter((v) => v)
    let csrfCookie = cookies.find((s) => s.startsWith('__csrf'))
    if (csrfCookie) {
      csrfCookie = csrfCookie.replace('__csrf', 'CSRF')
      document.cookie = csrfCookie
    }
  }
}
