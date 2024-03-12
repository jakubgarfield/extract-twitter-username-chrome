function isValidUrl(urlString) {
  try { 
    return Boolean(new URL(urlString)); 
  }
  catch(e){ 
    return false; 
  }
}

function extractTwitterUsernames() {
  var result = [];
  if (result.length === 0) {
    $("meta[name='twitter:creator']").each(function(meta) {
      var content = this.content;
      if (content !== null && content.startsWith("@")) {
        if (isValidUrl(content.substring(1))) {
          var usernameMatch = decodeURIComponent(content.substring(1)).match(/twitter.com\/(?:@){0,1}(\w*)/);
          if (usernameMatch !== null && usernameMatch[1] !== "") {
            result.push(usernameMatch[1]);
            return;
          }
        }
        if (content.substring(1)) {
          result.push(content.substring(1));
          return;
        }
      }
    });
    
    $("a[href*='twitter']").each(function(index, link) {
      var url = this.href;
      var usernameMatch = decodeURIComponent(url).match(/twitter.com\/(?:@){0,1}(\w*)/);

      if (usernameMatch !== null && usernameMatch[1] !== "" && !["intent", "search", "share", "home"].includes(usernameMatch[1])) {
        result.push(usernameMatch[1]);
        return;
      }
  
      var viaMatch = url.match(/via[%20@|=](\w*)/);
      if (viaMatch !== null && viaMatch[1] !== "") {
        result.push(viaMatch[1]);
        return;
      }
  
      var screenNameMatch = url.match(/screen_name=(\w*)/);
      if (screenNameMatch !== null && screenNameMatch[1] !== "") {
        result.push(screenNameMatch[1]);
        return;
      }
    });
    $("iframe[id*='twitter-widget-']").each(function(iframe) {
      var widgetId = this.dataset.widgetId;
      var screenName = this.dataset.screenName;

      if (widgetId) {
        var profileMatch = widgetId.match(/profile:(\w*)/);
        if (profileMatch !== null && profileMatch[1] !== "") {
          result.push(profileMatch[1]);
          return;
        }
      }

      if (screenName) {
        result.push(screenName);
        return;
      }
    });
  }

  return result.map(function(i) { return i.toLowerCase(); }).filter(function(item, i, ar) { return ar.indexOf(item) === i; });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "getTwitterUsernames")
    sendResponse({ usernames: extractTwitterUsernames() });
  else
    sendResponse({});
});