function getUrl(tab){
	return (tab.url=="" && !!tab.pendingUrl && typeof tab.pendingUrl!=='undefined' && tab.pendingUrl!='')?tab.pendingUrl:tab.url;
}

  function send() {

    let params = {
      active: true,
      currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
     chrome.runtime.sendMessage({id: tabs[0].id, url: getUrl(tabs[0]), type:'action'}, function(response){});
		}
    }

send();
  
setTimeout(function(){window.close();}, 5000);