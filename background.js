try {
function getUrl(tab){
	if(tab.pendingUrl!=null){
	return (tab.url=="")?tab.pendingUrl:tab.url;
	}else{
		
		if(tab.url!=null){
			return tab.url;
		}else{
			return tab; //if tab.url not there
		}
	
	}
}
function send(message) {

    let params = {
      active: true,
      currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
      console.log("got tabs");
      console.log(tabs);
      // send a message to the content script
     // let message = userinput.value();
      let msg = {
        message: message
      };
      chrome.tabs.sendMessage(tabs[0].id, msg);
    }

  }

chrome.action.onClicked.addListener((tab) => {
  send(getUrl(tab));
});


} catch (e) {	
  console.error(e);
}