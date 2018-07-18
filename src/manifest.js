module.exports = {
  name: 'Bitome - Cryptocurrency checker',
  short_name: 'Bitome',
  version: '1.0.10',
  description: 'The price checker for almost all cryptocurrencies (eg. BTC, ETH, XRP, LTC). Search / convert / set alert are in one place.',
  author: 'kelvin ho',
  manifest_version: 2,
  icons: { '16': 'icons/16.png', '128': 'icons/128.png' },
  permissions: [
    '<all_urls>',
    '*://*/*',
    'activeTab',
    'tabs',
    'cookies',
    'background',
    'contextMenus',
    'unlimitedStorage',
    'storage',
    'alarms',
    'notifications',
    'identity',
    'identity.email'
  ],
  browser_action: {
    default_title: 'Bitome - Crypto price',
    default_popup: 'pages/popup.html'
  },
  background: {
    persistent: false,
    page: 'pages/background.html'
  },
  devtools_page: 'pages/devtools.html',
  options_page: 'pages/options.html',
  content_scripts: [{
    js: [
      'js/vendor.js',
      'js/content.js'
    ],
    run_at: 'document_idle',
    matches: ['http://*/*', 'https://*/*']
  }],
  content_security_policy: "connect-src 'self' ws://localhost:9090 https://api.coinmarketcap.com; style-src https://fonts.googleapis.com/ 'unsafe-inline'; script-src 'self' https://www.google-analytics.com https://www.googletagmanager.com 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: [ 'panel.html', 'js/content.js' ]
}
