import parse from "url-parse";

export default class BrowserOauthFlow {

  constructor({ credentialToken, host, loginUrl }) {
    this.credentialToken = credentialToken;
    this.host = host;
    this.loginUrl = loginUrl;
    this._credentialSecretPromise = new Promise((resolve, reject) => {
      this._resolvePromise = resolve;
      this._rejectPromise = reject;
    });
  }

  _startPolling() {
    console.group('Start Polling')
    console.log('%cHost', 'color: #4AF2A1', this.host)
    console.log('%cCredentail Token', 'color: #6638F0', this.credentialToken)
    const request = JSON.stringify({
      credentialToken: this.credentialToken
    })
    this.intervalId = window.setInterval(() => {
      console.log(this.popup.document.querySelector('#config'))
      this.popup.postMessage(request, this.host);
    }, 100)
    window.addEventListener("message", ::this._onMessage)
    console.groupEnd()
  }

  _stopPolling() {
    window.clearInterval(this.intervalId);
  }

  _onMessage({ data, origin }) {
    try {
      const message = JSON.parse(data);
      if (parse(origin).host !== this.host) {
        return;
      }
      if (message.credentialToken === this.credentialToken) {
        this._resolvePromise({
          credentialToken: message.credentialToken,
          credentialSecret: message.credentialSecret
        });
      }
      if (message.error) {
        this._rejectPromise(message.error);
      }
    } catch (ignore) {
      /*
       *   Simply ignore messages that:
       *       - are not JSON strings
       *       - don't match our `host`
       *       - dont't match our `credentialToken`
       */
    }
  }

  _openPopup() {
    // Open the oauth popup
    console.group('Open Popup')
    console.log('%cLogin URL', 'color: #4AF2A1', this.loginUrl);
    this.popup = window.open(this.loginUrl, "_blank", "location=no,toolbar=no");
    console.log('%cPopup window', 'color: #6638F0', this.popup)
    // If the focus property exists, it's a function and it needs to be
    // called in order to focus the popup
    if (this.popup.focus) {
      this.popup.focus();
    }
    console.groupEnd()
  }

  _closePopup() {
    this.popup.close();
  }

  init() {
    this._openPopup();
    this._startPolling();
    return this._credentialSecretPromise.then(credentialSecret => {
      console.log('Before close Popup');
      this._stopPolling();
      this._closePopup();
      console.log(credentialSecret);
      return credentialSecret;
    });
  }

}
