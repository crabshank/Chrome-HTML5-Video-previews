function setup() {
  noCanvas();

 select('#scan').mousePressed(sca1);
 select('#flush').mousePressed(sca2);
 
 function sca1(){send("Scan!")}
  function sca2(){send("Flush!")}
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

}
