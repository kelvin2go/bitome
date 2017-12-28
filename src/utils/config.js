import devConfig from './devConfig'
import prodConfig from './prodConfig'

const CONFIG = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

export default CONFIG
