const config = require(`./${process.env.NODE_ENV}.js`)

export default Object.assign({
    apiHost: '',
}, config)