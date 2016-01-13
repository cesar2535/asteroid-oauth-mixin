import BrowserOauthFlow from "../platforms/browser"
import ChromeOauthFlow from '../platforms/chrome'

const platformsOauthFlowClasses = {
    browser: BrowserOauthFlow,
    chrome: ChromeOauthFlow
}

export default function openOauthPopup (platform, host, credentialToken, loginUrl, afterCredentialSecretReceived) {
    const OauthFlow = platformsOauthFlowClasses[platform]
    const oauthFlow = new OauthFlow({host, credentialToken, loginUrl})
    return oauthFlow.init()
        .then(afterCredentialSecretReceived)
}
