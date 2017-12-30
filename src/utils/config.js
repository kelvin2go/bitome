import devConfig from './configDev'
import prodConfig from './configProd'

const CONFIG = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

export default CONFIG
