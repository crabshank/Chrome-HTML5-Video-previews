try {
function getUrl(tab){
	return (tab.url=="" && !!tab.pendingUrl && typeof tab.pendingUrl!=='undefined' && tab.pendingUrl!='')?tab.pendingUrl:tab.url;
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
