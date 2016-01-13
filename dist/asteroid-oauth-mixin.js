(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AsteroidOauthMixin"] = factory();
	else
		root["AsteroidOauthMixin"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.init = init;
	exports.registerOauthProvider = registerOauthProvider;
	exports.loginWith = loginWith;

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _urlParse = __webpack_require__(1);

	var _urlParse2 = _interopRequireDefault(_urlParse);

	var _libOpenOauthPopup = __webpack_require__(5);

	var _libOpenOauthPopup2 = _interopRequireDefault(_libOpenOauthPopup);

	// TODO implement some other common providers such as facebook and twitter

	var _providersGoogle = __webpack_require__(7);

	var google = _interopRequireWildcard(_providersGoogle);

	var _providersFacebook = __webpack_require__(12);

	var facebook = _interopRequireWildcard(_providersFacebook);

	var providers = { google: google, facebook: facebook };

	function init(_ref) {
	    var endpoint = _ref.endpoint;
	    var platform = _ref.platform;

	    this.subscribe("meteor.loginServiceConfiguration");
	    this.oauth = {
	        platform: platform,
	        url: (0, _urlParse2["default"])(endpoint)
	    };
	}

	function registerOauthProvider(provider) {
	    providers[provider.name] = provider;
	}

	function loginWith(providerName, scope) {
	    var _this = this;

	    var options = providers[providerName].getOptions({
	        url: this.oauth.url,
	        // The mixin which implements collections must also implement the
	        // getServiceConfig method
	        configCollection: this.getServiceConfig(providerName),
	        scope: scope
	    });
	    console.log(options);
	    return (0, _libOpenOauthPopup2["default"])(this.oauth.platform, this.oauth.url.host, options.credentialToken, options.loginUrl, function (oauth) {
	        return _this.login({ oauth: oauth });
	    });
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var required = __webpack_require__(2)
	  , lolcation = __webpack_require__(3)
	  , qs = __webpack_require__(4)
	  , relativere = /^\/(?!\/)/;

	/**
	 * These are the parse instructions for the URL parsers, it informs the parser
	 * about:
	 *
	 * 0. The char it Needs to parse, if it's a string it should be done using
	 *    indexOf, RegExp using exec and NaN means set as current value.
	 * 1. The property we should set when parsing this value.
	 * 2. Indication if it's backwards or forward parsing, when set as number it's
	 *    the value of extra chars that should be split off.
	 * 3. Inherit from location if non existing in the parser.
	 * 4. `toLowerCase` the resulting value.
	 */
	var instructions = [
	  ['#', 'hash'],                        // Extract from the back.
	  ['?', 'query'],                       // Extract from the back.
	  ['//', 'protocol', 2, 1, 1],          // Extract from the front.
	  ['/', 'pathname'],                    // Extract from the back.
	  ['@', 'auth', 1],                     // Extract from the front.
	  [NaN, 'host', undefined, 1, 1],       // Set left over value.
	  [/\:(\d+)$/, 'port'],                 // RegExp the back.
	  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
	];

	/**
	 * The actual URL instance. Instead of returning an object we've opted-in to
	 * create an actual constructor as it's much more memory efficient and
	 * faster and it pleases my CDO.
	 *
	 * @constructor
	 * @param {String} address URL we want to parse.
	 * @param {Boolean|function} parser Parser for the query string.
	 * @param {Object} location Location defaults for relative paths.
	 * @api public
	 */
	function URL(address, location, parser) {
	  if (!(this instanceof URL)) {
	    return new URL(address, location, parser);
	  }

	  var relative = relativere.test(address)
	    , parse, instruction, index, key
	    , type = typeof location
	    , url = this
	    , i = 0;

	  //
	  // The following if statements allows this module two have compatibility with
	  // 2 different API:
	  //
	  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
	  //    where the boolean indicates that the query string should also be parsed.
	  //
	  // 2. The `URL` interface of the browser which accepts a URL, object as
	  //    arguments. The supplied object will be used as default values / fall-back
	  //    for relative paths.
	  //
	  if ('object' !== type && 'string' !== type) {
	    parser = location;
	    location = null;
	  }

	  if (parser && 'function' !== typeof parser) {
	    parser = qs.parse;
	  }

	  location = lolcation(location);

	  for (; i < instructions.length; i++) {
	    instruction = instructions[i];
	    parse = instruction[0];
	    key = instruction[1];

	    if (parse !== parse) {
	      url[key] = address;
	    } else if ('string' === typeof parse) {
	      if (~(index = address.indexOf(parse))) {
	        if ('number' === typeof instruction[2]) {
	          url[key] = address.slice(0, index);
	          address = address.slice(index + instruction[2]);
	        } else {
	          url[key] = address.slice(index);
	          address = address.slice(0, index);
	        }
	      }
	    } else if (index = parse.exec(address)) {
	      url[key] = index[1];
	      address = address.slice(0, address.length - index[0].length);
	    }

	    url[key] = url[key] || (instruction[3] || ('port' === key && relative) ? location[key] || '' : '');

	    //
	    // Hostname, host and protocol should be lowercased so they can be used to
	    // create a proper `origin`.
	    //
	    if (instruction[4]) {
	      url[key] = url[key].toLowerCase();
	    }
	  }

	  //
	  // Also parse the supplied query string in to an object. If we're supplied
	  // with a custom parser as function use that instead of the default build-in
	  // parser.
	  //
	  if (parser) url.query = parser(url.query);

	  //
	  // We should not add port numbers if they are already the default port number
	  // for a given protocol. As the host also contains the port number we're going
	  // override it with the hostname which contains no port number.
	  //
	  if (!required(url.port, url.protocol)) {
	    url.host = url.hostname;
	    url.port = '';
	  }

	  //
	  // Parse down the `auth` for the username and password.
	  //
	  url.username = url.password = '';
	  if (url.auth) {
	    instruction = url.auth.split(':');
	    url.username = instruction[0] || '';
	    url.password = instruction[1] || '';
	  }

	  //
	  // The href is just the compiled result.
	  //
	  url.href = url.toString();
	}

	/**
	 * This is convenience method for changing properties in the URL instance to
	 * insure that they all propagate correctly.
	 *
	 * @param {String} prop Property we need to adjust.
	 * @param {Mixed} value The newly assigned value.
	 * @returns {URL}
	 * @api public
	 */
	URL.prototype.set = function set(part, value, fn) {
	  var url = this;

	  if ('query' === part) {
	    if ('string' === typeof value && value.length) {
	      value = (fn || qs.parse)(value);
	    }

	    url[part] = value;
	  } else if ('port' === part) {
	    url[part] = value;

	    if (!required(value, url.protocol)) {
	      url.host = url.hostname;
	      url[part] = '';
	    } else if (value) {
	      url.host = url.hostname +':'+ value;
	    }
	  } else if ('hostname' === part) {
	    url[part] = value;

	    if (url.port) value += ':'+ url.port;
	    url.host = value;
	  } else if ('host' === part) {
	    url[part] = value;

	    if (/\:\d+/.test(value)) {
	      value = value.split(':');
	      url.hostname = value[0];
	      url.port = value[1];
	    }
	  } else {
	    url[part] = value;
	  }

	  url.href = url.toString();
	  return url;
	};

	/**
	 * Transform the properties back in to a valid and full URL string.
	 *
	 * @param {Function} stringify Optional query stringify function.
	 * @returns {String}
	 * @api public
	 */
	URL.prototype.toString = function toString(stringify) {
	  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

	  var query
	    , url = this
	    , result = url.protocol +'//';

	  if (url.username) {
	    result += url.username;
	    if (url.password) result += ':'+ url.password;
	    result += '@';
	  }

	  result += url.hostname;
	  if (url.port) result += ':'+ url.port;

	  result += url.pathname;

	  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
	  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

	  if (url.hash) result += url.hash;

	  return result;
	};

	//
	// Expose the URL parser and some additional properties that might be useful for
	// others.
	//
	URL.qs = qs;
	URL.location = lolcation;
	module.exports = URL;


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Check if we're required to add a port number.
	 *
	 * @see https://url.spec.whatwg.org/#default-port
	 * @param {Number|String} port Port number we need to check
	 * @param {String} protocol Protocol we need to check against.
	 * @returns {Boolean} Is it a default port for the given protocol
	 * @api private
	 */
	module.exports = function required(port, protocol) {
	  protocol = protocol.split(':')[0];
	  port = +port;

	  if (!port) return false;

	  switch (protocol) {
	    case 'http':
	    case 'ws':
	    return port !== 80;

	    case 'https':
	    case 'wss':
	    return port !== 443;

	    case 'ftp':
	    return port !== 21;

	    case 'gopher':
	    return port !== 70;

	    case 'file':
	    return false;
	  }

	  return port !== 0;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/**
	 * These properties should not be copied or inherited from. This is only needed
	 * for all non blob URL's as the a blob URL does not include a hash, only the
	 * origin.
	 *
	 * @type {Object}
	 * @private
	 */
	var ignore = { hash: 1, query: 1 }
	  , URL;

	/**
	 * The location object differs when your code is loaded through a normal page,
	 * Worker or through a worker using a blob. And with the blobble begins the
	 * trouble as the location object will contain the URL of the blob, not the
	 * location of the page where our code is loaded in. The actual origin is
	 * encoded in the `pathname` so we can thankfully generate a good "default"
	 * location from it so we can generate proper relative URL's again.
	 *
	 * @param {Object} loc Optional default location object.
	 * @returns {Object} lolcation object.
	 * @api public
	 */
	module.exports = function lolcation(loc) {
	  loc = loc || global.location || {};
	  URL = URL || __webpack_require__(1);

	  var finaldestination = {}
	    , type = typeof loc
	    , key;

	  if ('blob:' === loc.protocol) {
	    finaldestination = new URL(unescape(loc.pathname), {});
	  } else if ('string' === type) {
	    finaldestination = new URL(loc, {});
	    for (key in ignore) delete finaldestination[key];
	  } else if ('object' === type) for (key in loc) {
	    if (key in ignore) continue;
	    finaldestination[key] = loc[key];
	  }

	  return finaldestination;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Simple query string parser.
	 *
	 * @param {String} query The query string that needs to be parsed.
	 * @returns {Object}
	 * @api public
	 */
	function querystring(query) {
	  var parser = /([^=?&]+)=([^&]*)/g
	    , result = {}
	    , part;

	  //
	  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
	  // the lastIndex property so we can continue executing this loop until we've
	  // parsed all results.
	  //
	  for (;
	    part = parser.exec(query);
	    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
	  );

	  return result;
	}

	/**
	 * Transform a query string to an object.
	 *
	 * @param {Object} obj Object that should be transformed.
	 * @param {String} prefix Optional prefix.
	 * @returns {String}
	 * @api public
	 */
	function querystringify(obj, prefix) {
	  prefix = prefix || '';

	  var pairs = [];

	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';

	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
	    }
	  }

	  return pairs.length ? prefix + pairs.join('&') : '';
	}

	//
	// Expose the module.
	//
	exports.stringify = querystringify;
	exports.parse = querystring;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = openOauthPopup;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _platformsBrowser = __webpack_require__(6);

	var _platformsBrowser2 = _interopRequireDefault(_platformsBrowser);

	var platformsOauthFlowClasses = {
	    browser: _platformsBrowser2["default"]
	};

	function openOauthPopup(platform, host, credentialToken, loginUrl, afterCredentialSecretReceived) {
	    var OauthFlow = platformsOauthFlowClasses[platform];
	    var oauthFlow = new OauthFlow({ host: host, credentialToken: credentialToken, loginUrl: loginUrl });
	    return oauthFlow.init().then(afterCredentialSecretReceived);
	}

	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _urlParse = __webpack_require__(1);

	var _urlParse2 = _interopRequireDefault(_urlParse);

	var BrowserOauthFlow = (function () {
	  function BrowserOauthFlow(_ref) {
	    var _this = this;

	    var credentialToken = _ref.credentialToken;
	    var host = _ref.host;
	    var loginUrl = _ref.loginUrl;

	    _classCallCheck(this, BrowserOauthFlow);

	    this.credentialToken = credentialToken;
	    this.host = host;
	    this.loginUrl = loginUrl;
	    this._credentialSecretPromise = new Promise(function (resolve, reject) {
	      _this._resolvePromise = resolve;
	      _this._rejectPromise = reject;
	    });
	  }

	  _createClass(BrowserOauthFlow, [{
	    key: '_startPolling',
	    value: function _startPolling() {
	      var _this2 = this;

	      console.group('Start Polling');
	      console.log('%cHost', 'color: #4AF2A1', this.host);
	      console.log('%cCredentail Token', 'color: #6638F0', this.credentialToken);
	      var request = JSON.stringify({
	        credentialToken: this.credentialToken
	      });
	      this.intervalId = window.setInterval(function () {
	        _this2.popup.postMessage(request, _this2.host);
	      }, 100);
	      window.addEventListener("message", this._onMessage.bind(this));
	      console.groupEnd();
	    }
	  }, {
	    key: '_stopPolling',
	    value: function _stopPolling() {
	      window.clearInterval(this.intervalId);
	    }
	  }, {
	    key: '_onMessage',
	    value: function _onMessage(_ref2) {
	      var data = _ref2.data;
	      var origin = _ref2.origin;

	      try {
	        var message = JSON.parse(data);
	        if ((0, _urlParse2['default'])(origin).host !== this.host) {
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
	  }, {
	    key: '_openPopup',
	    value: function _openPopup() {
	      // Open the oauth popup
	      console.group('Open Popup');
	      console.log('%cLogin URL', 'color: #F6CD77', this.loginUrl);
	      this.popup = window.open(this.loginUrl, "_blank", "location=no,toolbar=no");
	      console.log('%cPopup window', 'color: #BB4A51', this.popup);
	      // If the focus property exists, it's a function and it needs to be
	      // called in order to focus the popup
	      if (this.popup.focus) {
	        this.popup.focus();
	      }
	      console.groupEnd();
	    }
	  }, {
	    key: '_closePopup',
	    value: function _closePopup() {
	      this.popup.close();
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var _this3 = this;

	      this._openPopup();
	      this._startPolling();
	      return this._credentialSecretPromise.then(function (credentialSecret) {
	        console.log('Before close Popup');
	        _this3._stopPolling();
	        _this3._closePopup();
	        console.log(credentialSecret);
	        return credentialSecret;
	      });
	    }
	  }]);

	  return BrowserOauthFlow;
	})();

	exports['default'] = BrowserOauthFlow;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getOptions = getOptions;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _urlParse = __webpack_require__(1);

	var _urlParse2 = _interopRequireDefault(_urlParse);

	var _libGenerateCredentialToken = __webpack_require__(8);

	var _libGenerateCredentialToken2 = _interopRequireDefault(_libGenerateCredentialToken);

	var _libGetOauthState = __webpack_require__(9);

	var _libGetOauthState2 = _interopRequireDefault(_libGetOauthState);

	var _libGetOauthClientId = __webpack_require__(10);

	var _libGetOauthClientId2 = _interopRequireDefault(_libGetOauthClientId);

	var _libGetOauthProtocol = __webpack_require__(11);

	var _libGetOauthProtocol2 = _interopRequireDefault(_libGetOauthProtocol);

	var name = "google";

	exports.name = name;

	function getOptions(_ref) {
	    var url = _ref.url;
	    var configCollection = _ref.configCollection;
	    var scope = _ref.scope;

	    var credentialToken = (0, _libGenerateCredentialToken2["default"])();
	    var protocol = url.protocol;
	    var host = url.host;

	    var query = {
	        /*
	        *   `response_type` determines how the callback url is formed by the
	        *   google oauth service:
	        *       - `code` -> put the parameters in the querystring
	        *       - `token` -> put the parameters in the fragment
	        *   Meteor currently only supports a `code` response type
	        */
	        "response_type": "code",
	        "client_id": (0, _libGetOauthClientId2["default"])(configCollection),
	        "redirect_uri": (0, _libGetOauthProtocol2["default"])(protocol) + ("//" + host + "/_oauth/google"),
	        "state": (0, _libGetOauthState2["default"])(credentialToken),
	        "scope": scope || "openid email"
	    };
	    var loginUrl = (0, _urlParse2["default"])("https://accounts.google.com/o/oauth2/auth").set("query", query).toString();
	    return { credentialToken: credentialToken, loginUrl: loginUrl };
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = generateCredentialToken;

	function generateCredentialToken() {
	    var ret = "";
	    for (var i = 0; i < 8; i++) {
	        ret += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	    }
	    return ret;
	}

	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = getOauthState;

	function getOauthState(credentialToken) {
	    var state = {
	        loginStyle: "popup",
	        credentialToken: credentialToken,
	        isCordova: false
	    };
	    // Encode base64 as not all login services URI-encode the state
	    // parameter when they pass it back to us.
	    // TODO: document to include a btoa/atob polyfill to support older browsers
	    return window.btoa(JSON.stringify(state));
	}

	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = getOauthClientId;

	function getOauthClientId(serviceConfig) {
	    return serviceConfig.clientId || serviceConfig.consumerKey || serviceConfig.appId;
	}

	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = getOauthProtocol;

	function getOauthProtocol(protocol) {
	    if (protocol === "ws:" || protocol === "http:") {
	        return "http:";
	    } else if (protocol === "wss:" || protocol === "https:") {
	        return "https:";
	    }
	}

	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getOptions = getOptions;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _urlParse = __webpack_require__(1);

	var _urlParse2 = _interopRequireDefault(_urlParse);

	var _libGenerateCredentialToken = __webpack_require__(8);

	var _libGenerateCredentialToken2 = _interopRequireDefault(_libGenerateCredentialToken);

	var _libGetOauthState = __webpack_require__(9);

	var _libGetOauthState2 = _interopRequireDefault(_libGetOauthState);

	var _libGetOauthClientId = __webpack_require__(10);

	var _libGetOauthClientId2 = _interopRequireDefault(_libGetOauthClientId);

	var _libGetOauthProtocol = __webpack_require__(11);

	var _libGetOauthProtocol2 = _interopRequireDefault(_libGetOauthProtocol);

	var name = 'facebook';

	exports.name = name;

	function getOptions(_ref) {
	  var url = _ref.url;
	  var configCollection = _ref.configCollection;
	  var scope = _ref.scope;

	  var credentialToken = (0, _libGenerateCredentialToken2["default"])();
	  var protocol = url.protocol;
	  var host = url.host;

	  var query = {
	    client_id: (0, _libGetOauthClientId2["default"])(configCollection),
	    redirect_uri: (0, _libGetOauthProtocol2["default"])(protocol) + ("//" + host + "/_oauth/facebook"),
	    state: (0, _libGetOauthState2["default"])(credentialToken),
	    scope: scope || 'email'
	  };

	  var loginUrl = (0, _urlParse2["default"])("https://www.facebook.com/dialog/oauth?").set('query', query).toString();

	  return { credentialToken: credentialToken, loginUrl: loginUrl };
	}

/***/ }
/******/ ])
});
;