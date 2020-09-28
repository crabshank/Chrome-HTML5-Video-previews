var sk = 0;

function removeEls(d, array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != d) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

   function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }
  

var hed=document.getElementsByTagName('head')[0];
var bdy=document.getElementsByTagName('body')[0];
//var OG_Hd_CSS=hed.style.cssText;
//var OG_bdy_CSS=bdy.style.cssText;
var hider=document.createElement('style');
hide_HTML="*:not(video){visibility:hidden;};";

var tmbn=document.createElement('div');

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
        switch (message.message) {

case "Flush!":
chrome.extension.sendMessage({
message: "Flush!"
}, function(response) {});
console.log(message);
hider.innerHTML="*{visibility:initial;}";
var prv_butns = document.getElementsByClassName("prv_butn");

for (var i = prv_butns.length - 1; 0 <= i; i--){
if (prv_butns[i] && prv_butns[i].parentElement)
prv_butns[i].parentElement.removeChild(prv_butns[i]);
}
//tmbn.parentElement.removeChild(tmbn);
//hider.parentElement.removeChild(hider);
break;


case "Scan!":
hider.innerHTML=hide_HTML;
tmbn.style.cssText="visibility: initial !important;";
hed.insertAdjacentElement('beforeend',hider);
console.log(message);

var butn = [];
var videoTags = [...document.getElementsByTagName('video')];
var tmpVidTags = videoTags;
getStrms();
function getStrms(){
for (var k = 0, len = videoTags.length; k < len; k++) {
if ((videoTags[k].src == "") && (videoTags[k].currentSrc == "") && !(videoTags[k].duration >= 0)) {
tmpVidTags=removeEls(videoTags[k], videoTags);
}
}

videoTags=tmpVidTags;

for (var i = 0, len = videoTags.length; i < len; i++) {
if (videoTags[i].src !== "") {
createbutn(i, videoTags[i], videoTags[i].src);
} else if (videoTags[i].currentSrc !== "") {
createbutn(i, videoTags[i], videoTags[i].currentSrc);
}
}


console.log(videoTags);


}

		
		
		
                        function b_hide(b, v) {
                                var timer;
                                var hide = false;
                                b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important; position: absolute !important;";
                                v.addEventListener('mousemove', cursorhide, true);

                                function cursorhide() {
                                        if (!hide) {
                                                b.style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important; position: absolute !important;";
                                                clearTimeout(timer);
                                                timer = setTimeout(function() {
                                                        b.style.cssText = "display: none !important; visibility: hidden !important;";
                                                        hide = true;
                                                        setTimeout(function() {
                                                                hide = false;
                                                        }, 1);
                                                }, 3000);
                                        }
                                }
                        }

                        function createbutn(i, video, src) {
							video.controls=true;
							   video.style.cssText += "display: initial !important; visibility: initial !important; width: initial; height: initial;";
							   video.style.display = 'initial';
							   video.style.visibility = 'initial';
							   video.style.width = 'initial';
							   video.style.height = 'initial';
                                butn[i] = document.createElement("button");
                                butn[i].style.cssText = "display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important; position: absolute !important;";
                                butn[i].innerHTML = "Preview: " + video.nodeName + ", " + src+'<br> Duration: '+formatTime(video.duration);
                                butn[i].className = "prv_butn";
                                video.insertAdjacentElement('beforebegin', butn[i]);
                                butn[i].addEventListener("click", btclk(i, src));
                                video.addEventListener('mouseenter', b_hide(butn[i], video), true);
								console.log(src);
                        }
						
                        function btclk(i, src) {
                                return function() {

tmbn.setAttribute("id", "thumbsPrev");

var video=videoTags[i];

tmbn.style.cssText="visibility: initial !important; zoom: "+(24*(window.innerWidth/video.videoWidth)).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"% !important;";

window.addEventListener('resize', function () {
tmbn.style.cssText="visibility: initial !important; zoom: "+(24*(window.innerWidth/video.videoWidth)).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"% !important;";
});
hed.style.cssText="display: flex !important; overflow: overlay !important;"
bdy.style.cssText+="position: relative !important;"
bdy.style.position+="relative";
hed.insertAdjacentElement('beforeend',tmbn);
var t=0;

doThumbs();

//document.querySelectorAll('#thumbs')[0].addEventListener("DOMContentLoaded", function() {

/*
tmbn.addEventListener("click", function() {
	console.log(this);
	

	var index = [...document.querySelectorAll('figure')[0].parentElement.children].indexOf(document.querySelectorAll('figure')[0]);
	
	  //console.log($(('#thumbs > figure > canvas')[index]));


  });
//});
*/
var time_track=-1;

function doThumbs()
{

var aseek=1;

var ttmp=0;

var thumbs = tmbn;

video.pause();
    video.currentTime = 0;
video.pause();
t=Math.max(Math.ceil(video.duration/30),7); // /(at least one thumbnail every 30 seconds, or 8 thumbnail)
	thumbs.innerHTML = "";
	
//video.addEventListener('loadeddata', function() {
  //  video.currentTime = 0;
//}, false);
	
function thumbseek(){
	generateThumbnail();

	ttmp++;
	sk=ttmp*(video.duration/(t+1));

	if (ttmp<=t) {
		video.currentTime = sk;
	}else {
		aseek=0;
		time_track=-1;
		video.pause();
		video.currentTime=0;
		video.pause();
		var sync_butns = document.getElementsByClassName("prv_butn");

		for (var i = sync_butns.length - 1; 0 <= i; i--){
		if (sync_butns[i] && sync_butns[i].parentElement)
		sync_butns[i].parentElement.removeChild(sync_butns[i]);
		}
	}
}

function thumbseek(){
	if(!((ttmp==0)&&(video.readyState<2))){
	time_track =ttmp*(video.duration/t);
	generateThumbnail();
	ttmp++;
		if (ttmp<=t) {
			video.currentTime = ttmp*(video.duration/t);
		}else {
			video.pause();
			aseek=0;
			time_track=-1;
			ttmp=0;
			video.currentTime=0;
			video.pause();
			var sync_butns = document.getElementsByClassName("prv_butn");

			for (var i = sync_butns.length - 1; 0 <= i; i--){
			if (sync_butns[i] && sync_butns[i].parentElement)
			sync_butns[i].parentElement.removeChild(sync_butns[i]);
			}
		}
	}
}

video.addEventListener('seeked', function() {
	if((aseek==1)&&(video.currentTime>time_track)){
		thumbseek();
	}
}, false);

video.addEventListener('waiting', function() {
	if((aseek==1)&&(video.readyState>=2)&&(video.currentTime>time_track)){
		thumbseek();
	}
}, false);

video.addEventListener('seeking', function() {
	if((aseek==1)&&(video.readyState>=2)&&(video.currentTime>time_track)){
		thumbseek();
	}
}, false);


function generateThumbnail() {

var f = document.createElement("figure");
f.style.cssText="display: inline-grid !important; margin: 0px !important;  visibility:initial !important;"
var ct=document.createElement("figcaption");
ct.style.cssText="color: white !important; font-size: 100% !important; display: inline-table !important; position: absolute !important; background-color: #00000099 !important;  visibility:initial !important; font-size: 169% !important; font-family: Microsoft JhengHei UI !important; transform-origin: top left !important;"
console.log(f);
var c = document.createElement("canvas");
c.style.cssText="visibility:initial !important; display:initial !important;"
var ctx = c.getContext("2d");

let v_width = video.videoWidth;
let v_height = video.videoHeight;

c.width= v_width;
c.height=v_height;   

f.style.width= v_width;
f.style.height=v_height;


c.setAttribute('timestamp', video.currentTime);
let format_time=formatTime(video.currentTime);
c.setAttribute('timestamp_fmt', format_time);

ctx.drawImage(video, 0, 0, v_width, v_height);

  f.onclick= function(){
	video.currentTime =c.attributes.timestamp.nodeValue;
if(!document.pictureInPictureElement){
		video.scrollIntoView();
}
};


thumbs.appendChild(f);

f.appendChild(c);

ct.innerHTML=format_time;
f.appendChild(ct);
ct.style.cssText+="transform: scale("+(0.18*(f.clientWidth/ct.clientWidth)).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+");";




 
  }
}



                                };
                        }
						
                        console.log(butn);
						
                        chrome.extension.sendMessage({
                                message: "Thumbs created!"
                        }, function(response) {});
                        break;
						
						

        }
}