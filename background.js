function getUrl(tab) {
	return (tab.url == "" && !!tab.pendingUrl && typeof tab.pendingUrl !== 'undefined' && tab.pendingUrl != '') ? tab.pendingUrl : tab.url;
}

try {

var lastMsg=[];
var ext_id=chrome.runtime.id;

function send(message,dims,tabId,ctx) {
var msg={};

    if(dims){
	 msg = {
        message: message.msg,
		left: message.left,
		right: message.right,
		top: message.top,
		bottom: message.bottom,
		type: message.type,
		isVid: message.isVid
      };
	}else{
		 msg = {
        message: message
      };
		
	}
	if(typeof(ctx)!=='undefined'){
		msg.ctx=ctx;
	}
      chrome.tabs.sendMessage(tabId, msg);
    }


chrome.action.onClicked.addListener((tab) => {
  send(getUrl(tab),false,tab.id);
});

let mId="prime_"+ext_id;
let contexts = ["video"];
chrome.contextMenus.create({
	"title": "Select video - HTML5 Video previews page",
	"contexts": contexts,
	"id": mId
})

chrome.contextMenus.onClicked.addListener((info,tab) => {
	if(info.menuItemId===mId){
		send(getUrl(tab),false,tab.id,info.srcUrl);
	}
});

function handleMessage(request, sender, sendResponse) {
				if(request.message==='get_info'){
					sendResponse({info: sender}); // send to querying frame (response)
				}else if (request.type=='size'){
					 chrome.tabs.sendMessage(sender.tab.id, request);
				}else if(lastMsg[0]!=JSON.stringify(request) || lastMsg[1]!= JSON.stringify(sender)){
					lastMsg[0]=JSON.stringify(request);
					lastMsg[1]=JSON.stringify(sender);
					/*if (request.type=='open'){
						chrome.tabs.create({
						"url": request.msg,
						"windowId": sender.tab.windowId,
						"index": (sender.tab.index+1),
						"active": false
						}, function(tab) {});
					}else */if(request.type=='action'){
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