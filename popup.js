function copyToClipboard(text) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}

$(function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {action: "getTwitterUsernames"}, function(response) {
      if (response.usernames.length > 0) {
        copyToClipboard(response.usernames[0]);
        response.usernames.forEach(function(username) {
          $("#usernames").append("<li>" + username + "</li>");
        });
      } else {
        $("#usernames").append("<li>Not found</li>");
      }
    });
  });
});
