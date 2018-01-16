// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'report_back') {
    sendResponse(document.getElementsByTagName("h1")[0].innerHTML);
  }
});
