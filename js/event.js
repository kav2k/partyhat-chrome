function injectList(tabId, files){
  if(files.length == 0) return;
  var file = files.shift();
  if (file.match(/\.css$/)) {
    chrome.tabs.insertCSS(tabId, { file : file }, function(){ injectList(tabId, files); });
  } else if (file.match(/\.js$/)) {
    chrome.tabs.executeScript(tabId, { file : file }, function(){ injectList(tabId, files); });
  } else {
    injectList(tabId, files);
  }
}

chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.sendMessage(
    tab.id,
    {control: "show"},
    function(response) {
      if (!response) { // Have to inject everything
        injectList(tab.id, [
          "css/jquery-ui-1.9.2.custom.min.css",
          "css/partyhat_inject.css",
          "js/jquery.min.js",
          "js/jquery-ui-1.9.2.custom.min.js",
          "js/jquery.ui.rotatable.js",
          "js/inject.js"
        ]);
      }
  });
});