function extractTwitterUsernames() {
  var result = [];
  $("a[href*='twitter']").each(function(link) {
    var url = this.href;

    var usernameMatch = url.match(/twitter.com\/(\w*)/)
    if (usernameMatch !== null && usernameMatch[1] !== "intent" && usernameMatch[1] !== "share") {
      result.push(usernameMatch[1]);
    }

    var viaMatch = url.match(/via%20@(\w*)/);
    if (viaMatch !== null) {
      result.push(viaMatch[1]);
    }
  });

  return result.filter(function(item, i, ar) { return ar.indexOf(item) === i; });;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
 if (request.action == "getTwitterUsernames")
   sendResponse({ usernames: extractTwitterUsernames() });
 else
   sendResponse({});
});
