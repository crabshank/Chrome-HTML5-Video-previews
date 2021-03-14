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
function send(message,dims,tabId) {
var msg={};

    if(dims){
	 msg = {
        message: message.msg,
		left: message.left,
		right: message.right,
		top: message.top,
		bottom: message.bottom,
		type: message.type
      };
	}else{
		 msg = {
        message: message
      };
		
	}
      chrome.tabs.sendMessage(tabId, msg);
    }


chrome.action.onClicked.addListener((tab) => {
  send(getUrl(tab),false,tab.id);
});

function handleMessage(request, sender, sendResponse) {
  				if (request.type=='open'){
				chrome.tabs.create({
				"url": request.msg,
				"windowId": sender.tab.windowId,
				"index": (sender.tab.index+1),
				"active": false
				}, function(tab) {});
				}else{
				send(request,true,sender.tab.id);
				}
 // sendResponse({msg: 'Inaccessible frame expanded!'});
}

chrome.runtime.onMessage.addListener(handleMessage);


} catch (e) {	
  console.error(e);
}