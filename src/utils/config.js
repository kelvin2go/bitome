import devConfig from './devConfig'
import prodConfig from './prodConfig'

const CONFIG = process.env.node_env === 'production' ? prodConfig : devConfig

export default CONFIG
