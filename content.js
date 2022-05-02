function extractTwitterUsernames() {
  var result = [];
  $("a[href*='twitter']").each(function(link) {
    var url = this.href;

    var usernameMatch = url.match(/twitter.com\/(?:@){0,1}(\w*)/)
    if (usernameMatch !== null && !["intent", "search", "share", "home"].includes(usernameMatch[1])) {
      result.push(usernameMatch[1]);
      return;
    }

    var viaMatch = url.match(/via[%20@|=](\w*)/);
    if (viaMatch !== null) {
      result.push(viaMatch[1]);
      return;
    }

    var screenNameMatch = url.match(/screen_name=(\w*)/);
    if (screenNameMatch !== null) {
      result.push(screenNameMatch[1]);
      return;
    }
  });
  if (result.length === 0) {
    $("meta[name='twitter:creator']").each(function(meta) {
      var content = this.content;
      if (content != null && content.startsWith("@")) {
        result.push(content.substring(1));
        return;
      }
    });
  }

  return result.map(function(i) { return i.toLowerCase(); }).filter(function(item, i, ar) { return ar.indexOf(item) === i; });
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
 if (request.action == "getTwitterUsernames")
   sendResponse({ usernames: extractTwitterUsernames() });
 else
   sendResponse({});
});
