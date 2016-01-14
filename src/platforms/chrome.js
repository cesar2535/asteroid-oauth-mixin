import parse from "url-parse"

export default class ChromeOauthFlow {

  constructor({ credentialToken, host, loginUrl }) {
    this.credentialToken = credentialToken
    this.host = host
    this.loginUrl = loginUrl
    this._credentialSecretPromise = new Promise((resolve, reject) => {
      this._resolvePromise = resolve
      this._rejectPromise = reject
    });
    this._onTabUpdated = this._onTabUpdated.bind(this)
  }

  _startPolling() {
    console.group('Start Polling')
    console.log('%cHost', 'color: #4AF2A1', this.host)
    console.log('%cCredentail Token', 'color: #6638F0', this.credentialToken)
    const request = JSON.stringify({
      credentialToken: this.credentialToken
    })
    chrome.tabs.onUpdated.addListener(this._onTabUpdated)
    console.groupEnd()
  }

  _onTabUpdated(tabId, changeInfo) {
    const url = changeInfo.url
    console.log(`Change Info:`, changeInfo)
    console.log(`%cTab's Id:`, 'color: #4AF2A1', tabId)
    console.log(`%cTab's URL:`, 'color: #6638F0', url)
    if (tabId !== this.tabId) return
    if (!url) return
    if (url.indexOf('#') === -1) return

    chrome.tabs.sendMessage(tabId, { method: 'getHTML' }, res => {
      console.log('Response:', res)
      if (res.method === 'getHTML') {
        if (res.credentialToken === this.credentialToken) {
          this._resolvePromise({
            credentialToken: res.credentialToken,
            credentialSecret: res.credentialSecret
          })

          chrome.tabs.remove(tabId)
        }
      }
    })
  }

  _openPopup() {
    // Open the oauth popup
    console.group('Open Popup')
    console.log('%cLogin URL', 'color: #4AF2A1', this.loginUrl)
    chrome.tabs.create({
      url: this.loginUrl
    }, tab => {
      this.tabId = tab.id
    })
    console.log(`%cPopup tab's Id`, 'color: #6638F0', this.tabId)
    console.groupEnd()
  }

  init() {
    this._openPopup()
    this._startPolling()
    return this._credentialSecretPromise.then(credentialSecret => {
      console.log('Before close Popup')
      console.log(credentialSecret)
      return credentialSecret
    });
  }

}
