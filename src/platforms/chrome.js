import parse from "url-parse";

export default class ChromeOauthFlow {

  constructor({ credentialToken, host, loginUrl }) {
    this.credentialToken = credentialToken;
    this.host = host;
    this.loginUrl = loginUrl;
    this._credentialSecretPromise = new Promise((resolve, reject) => {
      this._resolvePromise = resolve;
      this._rejectPromise = reject;
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
    // const url = changeInfo.url
    // console.log(`%cTab's Id:`, 'color: #4AF2A1', tabId)
    // console.log(`%cTab's URL:`, 'color: #6638F0', url);
    // if (tabId !== this.tabId) return
    // if (!url) return
    // if (url.indexOf('#') === -1) return
    //
    // const hashPos = url.indexOf('#')
    // let hash
    // try {
    //   const encodedHashString = url.slice(hashPos + 1)
    //   const decodedHashString = decodeURIComponent(encodedHashString)
    //   console.log(`%cEncoded hash string:`, 'color: #5E5C95', encodedHashString)
    //   console.log(`%cDecoded hash string:`, 'color: #BB4A51', decodedHashString)
    //   hash = JSON.parse(decodedHashString)
    //   console.log(`%cHash:`, 'color: #F6CD77', hash)
    // } catch (err) {
    //   console.error(err)
    //   return
    // }
    // console.log(`Hash Token:`, hash.credentialToken)
    // console.log(`Hash Token:`, this.credentialToken)
    // if (hash.credentialToken === this.credentialToken) {
    //   this._resolvePromise({
    //     credentialToken: hash.credentialToken,
    //     credentialSecret: hash.credentialSecret
    //   })
    //
    //   chrome.tabs.remove(id)
    // }
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
      const tab = tabs[0]
      chrome.tabs.sendRequest(tab.id, { method: 'getHTML', tabId: tab.id }, response => {
        if (!response) return
        if (response.method === 'getHTML') {
          console.log(response)
          console.log(response.html)
          console.log(JSON.parse(response.html))
          chrome.tabs.remote(response.tabId)
        }
      })
    });
  }

  _openPopup() {
    // Open the oauth popup
    console.group('Open Popup')
    console.log('%cLogin URL', 'color: #4AF2A1', this.loginUrl);
    chrome.tabs.create({
      url: this.loginUrl
    }, tab => {
      this.tabId = tab.id
    })
    console.log(`%cPopup tab's Id`, 'color: #6638F0', this.tabId)
    console.groupEnd()
  }

  init() {
    this._openPopup();
    this._startPolling();
    return this._credentialSecretPromise.then(credentialSecret => {
      console.log('Before close Popup');
      console.log(credentialSecret);
      return credentialSecret;
    });
  }

}
