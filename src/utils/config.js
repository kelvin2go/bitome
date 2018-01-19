import devConfig from './configDev'
import prodConfig from './configProd'

const CONFIG = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

CONFIG.currencys = [
  {'value': 'USD'},
  {'value': 'AUD'},
  {'value': 'BRL'},
  {'value': 'CAD'},
  {'value': 'CHF'},
  {'value': 'CLP'},
  {'value': 'CNY'},
  {'value': 'CZK'},
  {'value': 'DKK'},
  {'value': 'EUR'},
  {'value': 'GBP'},
  {'value': 'HKD'},
  {'value': 'HUF'},
  {'value': 'IDR'},
  {'value': 'ILS'},
  {'value': 'INR'},
  {'value': 'JPY'},
  {'value': 'KRW'},
  {'value': 'MXN'},
  {'value': 'MYR'},
  {'value': 'NOK'},
  {'value': 'NZD'},
  {'value': 'PHP'},
  {'value': 'PKR'},
  {'value': 'PLN'},
  {'value': 'RUB'},
  {'value': 'SEK'},
  {'value': 'SGD'},
  {'value': 'THB'},
  {'value': 'TRY'},
  {'value': 'TWD'},
  {'value': 'ZAR'}
]

export default CONFIG
