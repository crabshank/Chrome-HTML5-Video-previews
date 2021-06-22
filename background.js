try{
var lifeline;

keepAlive();

chrome.runtime.onConnect.addListener((port)=> {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds	
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
 if (!!lifeline) return;
  for (var tab of await chrome.tabs.query({ url:"<all_urls>"})) {
    try {
							chrome.scripting.executeScript({
								  target: {tabId: tab.id},
								  files: ['port_connect.js'],
								}, () => {});
	  console.log(lifeline);
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
	  chrome.tabs.onReplaced.addListener(retryOnTabUpdate2);
	  chrome.tabs.onRemoved.addListener(retryOnTabUpdate3);
      return;
    } catch (e) {;}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
	  chrome.tabs.onReplaced.addListener(retryOnTabUpdate2);
	  chrome.tabs.onRemoved.addListener(retryOnTabUpdate3);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url) {
    keepAlive();
  }
}
async function retryOnTabUpdate2(addedTabId, removedTabId) {
    keepAlive();
}
async function retryOnTabUpdate3(tabId, removeInfo) {
    keepAlive();
}
	/*Source: https://stackoverflow.com/a/66618269 - wOxxOm*/
	
}catch(e){;}

try {
function getUrl(tab){
	return (tab.url=="" && !!tab.pendingUrl && typeof tab.pendingUrl!=='undefined' && tab.pendingUrl!='')?tab.pendingUrl:tab.url;
}

var lastMsg=[];

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
				if(lastMsg[0]!=JSON.stringify(request) || lastMsg[1]!= JSON.stringify(sender)){
					lastMsg[0]=JSON.stringify(request);
					lastMsg[1]=JSON.stringify(sender);
  				if (request.type=='open'){
				chrome.tabs.create({
				"url": request.msg,
				"windowId": sender.tab.windowId,
				"index": (sender.tab.index+1),
				"active": false
				}, function(tab) {});
				}else if(request.type=='action'){
				send(request.url,false,request.id);
				}else if(request.type!='init'){
				send(request,true,sender.tab.id);
				}
				}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 handleMessage(request, sender, sendResponse);
 return true;
	});


} catch (e) {	
  console.error(e);
}
