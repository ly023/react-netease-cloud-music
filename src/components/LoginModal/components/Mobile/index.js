import React from 'react'
import PropTypes from 'prop-types'
import {createForm, formShape} from 'rc-form'
import areaCode from 'constants/areaCode'
import FormItem from 'components/FormItem'
import KEY_CODE from 'constants/keyCode'
import {isValidMobileNumber} from 'utils'

import styles from '../../index.scss'

@createForm()
export default class Mobile extends React.Component {
    static propTypes = {
        form: formShape,
        onLogin: PropTypes.func,
        afterLogin: PropTypes.func,
    }

    constructor(props) {
        super(props)
        this.state = {
            countryCode: areaCode[0][3],
            areaCodeSelectVisible: false,
            responseError: ''
        }
    }

    setAreaCodeSelectVisible = (visible) => {
        this.setState({
            areaCodeSelectVisible: visible
        })
    }

    handleChangeCountryCode = (index) => {
        this.setState({
            areaCodeSelectVisible: false,
            countryCode: areaCode[index][3],
        })
    }

    validatePhone = (rule, value, callback) => {
        if (!value) {
            callback('请输入手机号')
            return
        }
        if (!isValidMobileNumber(value)) {
            callback('请输入正确的手机号')
            return
        }
        callback()
    }

    getErrorMessage = () => {
        const fieldsError = this.props.form.getFieldsError()
        const validError = Object.values(fieldsError).filter(v => !!v)
        return validError?.[0]
    }

    handleEnterKey = (e) => {
        const keyCode = e.nativeEvent.which || e.nativeEvent.keyCode
        if(keyCode === KEY_CODE.ENTER){
            this.handleSubmit()
        }
    }

    handleSubmit = () => {
        const {form, onLogin, afterLogin} = this.props
        form.validateFields({first: true}, (errors, values) => {

            if (!errors) {
                this.setState({responseError: ''})

                const payload = {
                    body: {
                        ...values,
                        countrycode: this.state.countryCode
                    }
                }

                this.setState({loading: true})

                onLogin && onLogin(payload,
                    () => {
                        this.setState({loading: false})
                        afterLogin && afterLogin()
                    },
                    (error) => {
                        this.setState({loading: false})
                        this.setState({
                            responseError: error?.responseJson?.message
                        })
                    })
            }
        })
    }

    render() {
        const {getFieldDecorator, getFieldError} = this.props.form
        const {countryCode, areaCodeSelectVisible, responseError, loading} = this.state

        const errorMessage = this.getErrorMessage()

        return (
            <div styleName="login-mobile">
                <FormItem classname={styles["login-phone-wrapper"]} error={getFieldError('phone')}>
                    <span styleName="login-code-current"
                        onClick={() => this.setAreaCodeSelectVisible(!areaCodeSelectVisible)}>
                        <span>+{countryCode}</span>
                        <span styleName="login-icon login-arrow"/>
                    </span>
                    <div styleName="login-input-wrapper">
                        {
                            getFieldDecorator('phone', {
                                initialValue: '',
                                rules: [
                                    {
                                        validator: this.validatePhone
                                    },
                                ],
                                validateTrigger: false
                            })(
                                <input
                                    type="number"
                                    placeholder="请输入手机号"
                                    styleName="login-input login-phone-number"
                                    onKeyPress={this.handleEnterKey}
                                />
                            )
                        }
                    </div>
                    {/*国家区号列表*/}
                    <ul styleName="login-code-options" className={areaCodeSelectVisible ? null : 'hide'}>
                        {
                            areaCode.map((item, index) => {
                                return <li key={item[0]} className="clearfix" styleName="login-code-item"
                                    onClick={() => this.handleChangeCountryCode(index)}>
                                    <span className="fl">{item[1]}</span>
                                    <span className="fr">+{item[3]}</span>
                                </li>
                            })
                        }
                    </ul>
                </FormItem>
                <FormItem classname="mt-10" error={getFieldError('password')}>
                    {
                        getFieldDecorator('password', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码'
                                },
                            ],
                            validateTrigger: false
                        })(
                            <input
                                type="password"
                                styleName="login-input"
                                placeholder="请输入密码"
                                onKeyPress={this.handleEnterKey}
                            />
                        )
                    }
                </FormItem>
                <div styleName="error-msg login-error" className={errorMessage || responseError ? null : 'hide'}>
                    <i styleName="login-icon"/><span>{errorMessage || responseError}</span>
                </div>
                <div styleName="login-option">
                    <label>
                        {
                            getFieldDecorator('rememberLogin', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <input type="checkbox"/>
                            )
                        }
                        自动登录
                    </label>
                    <a href={null} className="fr" styleName="login-option-link">忘记密码？</a>
                </div>
                <a
                    href={null}
                    hidefocus="true"
                    styleName="login-btn"
                    onClick={this.handleSubmit}
                ><i>{loading ? '登录中...' : '登录'}</i></a>
            </div>
        )
    }
}
