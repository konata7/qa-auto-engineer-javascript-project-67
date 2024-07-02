
  var gs_landing_params = {"mode":"main","offers":[],"cat_id":null,"order_id":null,"mid":103136,"user_id":"ee0b171a-8d16-4ca3-9095-ec60687fed72","url":"https:\u002F\u002Fru.hexlet.io\u002Fcourses","query":{"mode":"main","mid":"103136","order_id":"","cat_id":"","codes":"","deduplication":"","perf":"3158","gs_uid":"undefined","_t":"1719838660095","source":"https:\u002F\u002Fru.hexlet.io\u002Fcourses"}};


;(function () {
  function appendScript(url) {
  var gss = document.createElement("script");
  gss.type = "text/javascript";
  gss.async = true;
  gss.src = url;
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(gss, s);
}

  try {
    function parseKeyValueList(str, pairsSeparator, keyValueSeparator) {
  var result = {},
    pairs,
    pair,
    key, value, i, l;

  if (!keyValueSeparator) {
    keyValueSeparator = '=';
  }

  if (!str) {
    return result;
  }

  pairs = str.split(pairsSeparator);
  for (i = 0, l = pairs.length; i < l; i++) {
    pair = pairs[i]
      .replace(/^\s+|\s+$/g, '')
      .split(keyValueSeparator);
    try {
      key = decodeURIComponent(pair[0]);
      value = decodeURIComponent(pair[1]);
      result[key] = value;
    } catch (e) {}
  }

  return result;
}

var location = document.location;
var queryParams = parseKeyValueList(location.search.slice(1), '&');

var domain = (function () {
  var domain = location.hostname || location.host.split(':')[0];
  var domainParts = domain.split('.');
  var l = domainParts.length;

  if (l > 1) {
    domain = domainParts[l - 2] + '.' + domainParts[l - 1];
  }
  return domain;
}());

var getCookies = function () {
  return parseKeyValueList(document.cookie, ';');
};

var cookieTtl = parseInt(queryParams._gs_cttl, 10);
if (!cookieTtl || isNaN(cookieTtl)) {
  cookieTtl = 180;
}

function writeCookie(name, value, ttlSeconds) {
  if (!(name && value)) {
    return;
  }

  value = encodeURIComponent(value);
  var ttl = ttlSeconds || cookieTtl * 24 * 60 * 60;

  var date = new Date();
  date.setTime(date.getTime() + ttl * 1000);
  var expires = "; expires=" + date.toUTCString();
  var domainParam = 'domain=' + domain + '; ';

  document.cookie = name + "=" + value + expires + "; " + domainParam + "path=/;";
}

function writeCookieIfEmpty(name, value) {
  if (getCookies()[name]) {
    return;
  }
  writeCookie(name, value);
}


    writeCookieIfEmpty('gdeslon.ru.__arc_domain', 'gdeslon.ru');

    
        writeCookieIfEmpty('gdeslon.ru.user_id', 'ee0b171a-8d16-4ca3-9095-ec60687fed72');
    
    
    

    ;(function () {
  var clickflow = 'mode=main&mid=103136';

  function isIframe() {
    var res;
    try { res = window.self !== window.top; } catch (e) {}
    if (!res) try { res = !!window.frameElement } catch (e) {}
    return res;
  }

  function getScreenSize() {
    var res = [];
    try {
      var win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight || docElem.clientHeight || body.clientHeight;
      res = [x, y];
    } catch (e) {}
    return res;
  }

  function encodeChars(v) {
    return v.replace(/[!'()*]/g, function(c) { return '%' + c.charCodeAt(0).toString(16); });
  }

  (function () {
    var screenSize = getScreenSize();
    var cookies = getCookies();

    var params = {
      page_title: document.title,
      page_referer: document.referrer,
      url: window.location.href,
      is_iframe: isIframe(),
      screen_width: screenSize[0],
      screen_height: screenSize[1],
      aid: cookies["gdeslon.ru.__arc_aid"],
      token: cookies["gdeslon.ru.__arc_token"],
      user_id: cookies["gdeslon.ru.user_id"] || 'ee0b171a-8d16-4ca3-9095-ec60687fed72'
    };

    Object.keys(params).forEach(function (key) {
      if (params[key]) clickflow += '&' + key + '=' + encodeChars(encodeURIComponent(params[key]));
    });

    var domain = cookies['gdeslon.ru.__arc_gsp_domain'] || cookies['gdeslon.ru.__arc_domain'];
    domain = domain && domain !== 'gdeslon.ru' ? 'https://' + domain : 'https://clicks.gdeslon.ru';

    appendScript(domain + '/gsclick.js?_t=' + Date.now() + '&' + clickflow);
  })();
})();

  } catch (e) {
    try {
      (function () {
        var _url = "https://gdeslon.ru/error.js?source=gsp&_t=" + Date.now() + "&message=" + encodeURIComponent(e.message);
        appendScript(_url);
      })();
    } catch (c) {}
  }

  
}());
