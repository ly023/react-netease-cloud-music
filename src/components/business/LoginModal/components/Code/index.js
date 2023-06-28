import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import toast, {Toaster} from 'react-hot-toast'
import {requestQrKey, requestCreateQr, requestCheckQr} from 'services/user'
import {useModel} from 'hook/userModel'
import {LOGIN_MODE} from 'constants/login'
import {setAuthCooKie} from '../../util'
import './index.scss'

const CODE_LOGIN_STATUS = {
    EXPIRED: 800, // 二维码过期
    WAITING: 801, // 等待扫码
    BE_CONFIRMED: 802, // 待确认
    SUCCESS: 803, // 授权登录成功
}

function ScanQRCode({changeMode, afterLogin}) {
    const [qrCode, dispatch] = useModel({
        loading: false,
        beConfirmed: false,
        success: false,
        expired: false,
        message: '',
        key: '',
        url: ''
    })
    const timer = useRef(0)

    const checkQrCode = async (key) => {
        const res = await requestCheckQr({key})
        // 登录成功会返回cookies
        const {code, message, cookie} = res
        console.log(res, code, message)
        // 二维码过期
        if (code === CODE_LOGIN_STATUS.EXPIRED) {
            dispatch({
                beConfirmed: false,
                expired: true,
                message,
            })
            // 授权登录成功
        } else if (code === CODE_LOGIN_STATUS.SUCCESS) {
            toast.success(message)
            dispatch({
                beConfirmed: false,
                success: true,
                message,
            })
            setAuthCooKie(cookie)
            afterLogin && afterLogin()
        } else {
            // 待移动端确认
            dispatch({
                beConfirmed: code === CODE_LOGIN_STATUS.BE_CONFIRMED,
                message,
            })
            timer.current = window.setTimeout(() => {
                checkQrCode(key)
            }, 1000)
        }
    }

    const getQrCode = async () => {
        try {
            dispatch({
                loading: true,
                expired: false,
            })
            const {data: qrKeyData} = await requestQrKey()
            const key = qrKeyData.unikey
            const {data: qrCodeData} = await requestCreateQr({key: qrKeyData.unikey, qrimg: true})
            dispatch({
                key,
                url: qrCodeData.qrimg
            })
            checkQrCode(key)
        } finally {
            dispatch({
                loading: false
            })
        }
    }

    const refreshCode = () => {
        window.clearTimeout(timer.current)
        void getQrCode()
    }

    useEffect(() => {
        getQrCode()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => {
            if (timer.current) {
                window.clearTimeout(timer.current)
            }
        }
    }, [])

    const renderQrCodeStatus = () => {
        if (qrCode.loading) {
            return <div styleName="mask">
                <span styleName="loading-icon" />
            </div>
        }
        if (qrCode.expired) {
            return <div styleName="mask">
                <p>二维码已失效</p>
                <button styleName="refresh" onClick={refreshCode}>点击刷新</button>
            </div>
        }
    }

    const renderContent = () => {
        if (qrCode.beConfirmed) {
            return <div styleName="scan-success">
                <span styleName="success-icon" />
                <h2>扫描成功</h2>
                <p>请在手机上确认登录</p>
            </div>
        }
        return <div styleName="main">
            <div styleName="example-image"/>
            <div styleName="qr-code">
                <h3>扫码登录</h3>
                <div styleName="code-box">
                    {qrCode?.url ? <img src={qrCode?.url} alt="二维码" styleName="code"/> : null}
                    {renderQrCodeStatus()}
                </div>
                <p styleName="scan-tip">使用<strong> 网易云音乐App </strong>扫码登录</p>
            </div>
        </div>
    }

    return <div styleName="login-code">
        {renderContent()}
        <div>
            <button styleName="change-mode" onClick={() => changeMode(LOGIN_MODE.GUIDE.TYPE)}>选择其他登录模式</button>
        </div>
        <Toaster/>
    </div>
}

ScanQRCode.propTypes = {
    changeMode: PropTypes.func,

}

export default ScanQRCode
