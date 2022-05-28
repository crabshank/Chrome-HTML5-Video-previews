var sk = 0;
var captions=[];
var progresses=[];
var nowFlag=-1;
var cap=-1;
var cap_el;
var curr_thumb=0;
var perc_r;
var perc;
function removeEls(d, array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != d) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

function pgBar(myVdo,ix,ths,ev,attr,nxt){
			if(ev.buttons>0){
			ev.preventDefault();
			ev.stopPropagation();
			nowFlag=ix;
			let cur=parseFloat(attr.timestamp.nodeValue);
			let rct=ths.getBoundingClientRect();
			let fct=parseFloat(ths.parentElement.parentElement.parentElement.style.zoom)*0.01;
			 progresses[ix].value=(ev.offsetX / ((rct.right-rct.left)*fct));
			 myVdo.currentTime=(progresses[ix].value)*(nxt-cur)+cur;
			 curr_thumb=ix;
			 }
}
		

function simpleCopyArray(array){
		var newArray = [];
	    for (let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
		}
		return newArray;
}

function elRemover(el){
	if(typeof el!=='undefined' && !!el){
	if(typeof el.parentNode!=='undefined' && !!el.parentNode){
		el.parentNode.removeChild(el);
	}
	}
}

 console.image = function(url,f,c,t,tg) {
  var image = new Image();
  var scl=(f.clientWidth/c.clientWidth)/100;
  image.onload = function() {
    var style = [
      'font-size: 1px;',
      'padding: ' + scl*this.height + 'px ' + scl*this.width + 'px;',
      'background: url('+ url +') no-repeat;',
      'background-size: contain;'
     ].join(' ');
	 console.group(t+" added:");
     console.log('%c ', style);
     console.log(tg);
	 console.groupEnd();
  };
  image.src = url;
};

   function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }
  
function skip(event,vid,t) {
event=(event.originalEvent)?event.originalEvent:event;
event.preventDefault();
event.stopPropagation();
if(event.deltaY>0){
vid.currentTime -= (vid.duration/t)*0.05;
}
if (event.deltaY<0){
vid.currentTime +=  (vid.duration/t)*0.05;
}
}
  
var zm=1;
var hed=document.getElementsByTagName('head')[0];
var bdy=document.getElementsByTagName('body')[0];
var ifr=document.createElement('iframe');
hed.insertAdjacentElement('beforeend',ifr);

var doci=ifr.contentDocument;
var bdyi=doci.getElementsByTagName('body')[0];
var hedi=doci.getElementsByTagName('head')[0];
bdyi.style.cssText="margin: 0px 0px 0px 0px;";
hedi.style.cssText="margin: 0px 0px 0px 0px;";

var hider=document.createElement('style');
hide_HTML="*{visibility:hidden;} video,embed,iframe{visibility:initial !important;}";

var tmbn=doci.createElement('div');

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
 elRemover(prv_butns[i]);
}
 elRemover(ifr);
// elRemover(hider);
break;


case "Scan!":
hider.innerHTML=hide_HTML;
tmbn.style.cssText="visibility: initial !important;";
hed.insertAdjacentElement('beforeend',hider);
console.log(message);

var butn = [];
var videoTags = [...document.getElementsByTagName('video')];
var tmpVidTags = simpleCopyArray(videoTags);
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
                                b.style.cssText = "left: inherit !important; display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important; webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important; position: absolute !important;";
                                v.addEventListener('mousemove', cursorhide, true);

                                function cursorhide() {
                                        if (!hide) {
                                                b.style.cssText = "left: inherit !important; display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important; position: absolute !important;";
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
							        for (let j=0; j<i; j++){
										if (typeof butn[j]==="undefined"){
											butn[j]="";
										}
									}
							video.controls=true;
							   video.style.setProperty("display", "initial", "important");
							   video.style.setProperty("visibility", "initial", "important");
							   video.style.setProperty("width", "inherit", "important");
							   video.style.setProperty("height", "inherit", "important");
                                butn[i] = document.createElement("button");
                                butn[i].style.cssText = "left: inherit !important; display: initial !important; visibility: initial !important; z-index: "+Number.MAX_SAFE_INTEGER+" !important;  webkit-text-fill-color: black !important; border-width: 2px !important; border-style: outset !important; background-color: buttonface !important; border-color: buttonface !important; position: absolute !important;";
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

ifr.style.cssText="visibility: initial !important; width: 100% !important; border-bottom-width: 0px !important; border-left-width: 0px !important; border-right-width: 0px !important; border-top-width: 0px; !important";

zm=0.24*(window.innerWidth/video.videoWidth);
tmbn.style.cssText="visibility: initial !important; zoom: "+(zm*100).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"% !important;";

window.addEventListener('resize', function () {
zm=0.24*(window.innerWidth/video.videoWidth);
tmbn.style.cssText="visibility: initial !important; zoom: "+(zm*100).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"% !important;";
ifr.style.height=Math.ceil(tmbn.clientHeight*zm+15)+'px'
});
hed.style.cssText="display: flex !important; overflow: overlay !important;"
bdy.style.cssText+="position: relative !important;"
bdy.style.position+="relative";
bdyi.insertAdjacentElement('afterbegin',tmbn);
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
captions=[];
var mx=-3000;
var t_a=0;
var t_b=0;
var aseek=1;

 video.ontimeupdate= () => {
 if(aseek==0){
	for(let i=0;i<captions.length;i++){
	captions[i].style.display='inline-table';
	captions[i].innerText=captions[i].parentElement.previousSibling.attributes.timestamp_fmt.nodeValue;
	captions[i].style.backgroundColor="#00000099";
	}
	
		for(let i=0;i<progresses.length;i++){
		progresses[i].style.display='none';
		}
		
	cap=(cap!=-1)?cap:video.currentTime*(t)/video.duration;
	cap_el=Math.floor(cap);
	perc_r=Math.min(1,Math.max(0,cap-cap_el));
	perc=(perc_r*100).toLocaleString('en-GB', {minimumFractionDigits: 1, maximumFractionDigits: 1});

	
if(captions.length==t){




if (cap_el<captions.length){
var attr=captions[cap_el].parentElement.previousSibling.attributes;
}else if (cap_el>=captions.length){
var attr=captions[captions.length-1].parentElement.previousSibling.attributes;
}

if(nowFlag>-1){
var attr_now=captions[nowFlag].parentElement.previousSibling.attributes;
}

if (cap_el+1<captions.length){
var attr_next=captions[cap_el+1].parentElement.previousSibling.attributes;
	if(nowFlag>-1){
			//captions[nowFlag].innerText=attr_now.timestamp_fmt.nodeValue+" (NOW!)";
			captions[nowFlag].style.display="none";
			progresses[nowFlag].style.display="";
			progresses[nowFlag].title=perc+"%";
			curr_thumb=nowFlag;
			captions[nowFlag].style.backgroundColor="#0004ff99";
			
			progresses[nowFlag].value=perc_r;
			captions[nowFlag].parentElement.parentElement.onmousemove=function (e) {
			pgBar(video,nowFlag,progresses[nowFlag],e,attr,attr_next.timestamp.nodeValue);
			}
			nowFlag=-1;
			
	}else if (cap==cap_el){
			//captions[cap_el].innerText=attr.timestamp_fmt.nodeValue+" (NOW!)";
			captions[cap_el].style.display="none";
			progresses[cap_el].style.display="";
			progresses[cap_el].title=perc+"%";
			curr_thumb=cap_el;
			captions[cap_el].style.backgroundColor="#0004ff99";
			progresses[cap_el].value=perc_r;
			captions[cap_el].parentElement.parentElement.onmousemove=function (e) {
			pgBar(video,cap_el,progresses[cap_el],e,attr,attr_next.timestamp.nodeValue);
			}
	}else{
		var until=(cap_el<captions.length)?Math.max(0,attr_next.timestamp.nodeValue-video.currentTime):Math.max(0,video.duration-video.currentTime);
		until=formatTime(until,1);
			captions[cap_el+1].innerText=attr_next.timestamp_fmt.nodeValue+" (NEXT) ["+until+"]";
			//captions[cap_el].innerText=attr.timestamp_fmt.nodeValue+" (LAST) ["+perc+"%]";
			captions[cap_el].style.display="none";
			progresses[cap_el].style.display="";
			progresses[cap_el].title=perc+"%";
			curr_thumb=cap_el;
			captions[cap_el].style.backgroundColor="#006115c7";
			progresses[cap_el].value=perc_r;
			captions[cap_el].parentElement.parentElement.onmousemove=function (e) {
			pgBar(video,cap_el,progresses[cap_el],e,attr,attr_next.timestamp.nodeValue);
			}
	}
}else{

	if(nowFlag>-1){
			//captions[nowFlag].innerText=attr_now.timestamp_fmt.nodeValue+" (NOW!)";
			captions[nowFlag].style.display="none";
			progresses[nowFlag].style.display="";
			progresses[nowFlag].title=perc+"%";
			curr_thumb=nowFlag;
			captions[nowFlag].style.backgroundColor="#0004ff99";
					progresses[nowFlag].value=perc_r;
			captions[nowFlag].parentElement.parentElement.onmousemove=function (e) {
			pgBar(video,nowFlag,progresses[nowFlag],e,attr,video.duration);
			}
	}else if (cap==cap_el){
		if(cap_el>=captions.length){
			//captions[captions.length-1].innerText=attr.timestamp_fmt.nodeValue+" (LAST) ["+100+".0%]";
			captions[captions.length-1].style.display="none";
			progresses[captions.length-1].style.display="";
			progresses[captions.length-1].title=perc+"%";
			curr_thumb=captions.length-1;
			captions[captions.length-1].style.backgroundColor="#006115c7";	
			progresses[captions.length-1].value=perc_r;
			captions[captions.length-1].parentElement.parentElement.onmousemove=function (e) {
			pgBar(video,captions.length-1,progresses[captions.length-1].value,e,attr,video.duration);
			}
		}else{
		//captions[cap_el].innerText=attr.timestamp_fmt.nodeValue+" (NOW!)";
		captions[cap_el].style.display="none";
		progresses[cap_el].style.display="";
		progresses[cap_el].title=perc+"%";
		curr_thumb=cap_el;
		captions[cap_el].style.backgroundColor="#0004ff99";
		progresses[cap_el].value=perc_r;
			captions[cap_el].parentElement.parentElement.onmousemove=function (e) {
			pgBar(video,cap_el,progresses[cap_el],e,attr,video.duration);
			}
		}
	}else{
			//captions[captions.length-1].innerText=attr.timestamp_fmt.nodeValue+" (LAST) ["+perc+"%]";
			captions[captions.length-1].style.display="none";
			progresses[captions.length-1].style.display="";
			progresses[captions.length-1].title=perc+"%";
			curr_thumb=captions.length-1;
			captions[captions.length-1].style.backgroundColor="#006115c7";
			progresses[captions.length-1].value=perc_r;
			captions[captions.length-1].parentElement.parentElement.onmousemove=function(e) {
			pgBar(video,captions.length-1,progresses[captions.length-1],e,attr,video.duration);
			}
	}
		
}
}
cap=-1;
}
 }

var ttmp=0;

var thumbs = tmbn;

video.pause();
    video.currentTime = 0;
video.pause();
t=Math.max(Math.ceil(video.duration/30),8); // /(at least one thumbnail every 30 seconds, or 8 thumbnail)
	thumbs.innerHTML = "";
	
//video.addEventListener('loadeddata', function() {
  //  video.currentTime = 0;
//}, false);
	
	var gtmv = setInterval(getMoving, (Math.abs(mx)+1));
	
	function getMoving(){
		let p_n=performance.now();
		let df=p_n-t_b;
		if(df>mx){
			video.play();
			t_a=p_n;
			t_b=p_n;
			mx=df;
		}
	}
	
	
function endGtMv() {
  clearInterval(gtmv);
}


function thumbseek(){
	if(!((ttmp==0)&&(video.readyState<2))){
		t_a=performance.now();
		if(!video.paused){
			video.pause();
		}
	time_track =ttmp*(video.duration/t);
	generateThumbnail();
	ttmp++;
		if (ttmp<t) {
			t_b=performance.now();
			let tm=t_b-t_a;
			mx=(tm>mx)?tm:mx;
			video.currentTime = ttmp*(video.duration/t);
		}else {
			endGtMv();
			video.pause();
			aseek=0;
			time_track=-1;
			ttmp=0;
			video.currentTime=0;
			video.pause();
			video.onwheel= (event) => {
			skip(event,video,t);
			}
			var sync_butns = document.getElementsByClassName("prv_butn");

			for (var i = sync_butns.length - 1; 0 <= i; i--){
			if (sync_butns[i] && sync_butns[i].parentElement)
			 elRemover(sync_butns[i]);
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

var f = doci.createElement("figure");
f.style.cssText="display: inline-grid !important; margin: 0px !important;  visibility:initial !important;"
var ct=doci.createElement("figcaption");
ct.style.cssText="color: white !important; font-size: 100% !important; display: inline-table !important; position: absolute !important; background-color: #00000099 !important;  visibility:initial !important; font-size: 169% !important; font-family: Microsoft JhengHei UI !important; transform-origin: top left !important;"

var pgs=document.createElement("section");
var pgb=document.createElement("progress");
pgb.max=1;
pgb.value=0;
pgb.title='0.0%';
pgb.style.cssText="display: none !important; width: inherit !important; position: absolute !important; border-radius: 0  !important; height: 0.9em !important;";
pgs.style.cssText="display: contents !important; width: inherit !important; position: absolute !important;";



var c = doci.createElement("canvas");
var img = doci.createElement("img");
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

/*let co_flg=false;
if (/^([\w]+\:)?\/\//.test(src) && src.indexOf(location.host) === -1) {
 co_flg=true;
}*/
ctx.drawImage(video, 0, 0, v_width, v_height);

  f.onclick= function(){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	if(window.getComputedStyle(progresses[index]).display==='none'){
	nowFlag=index;
	cap=index;
	video.currentTime =c.attributes.timestamp.nodeValue;
if(!document.pictureInPictureElement){
		video.scrollIntoView();
}
  }
};


thumbs.appendChild(f);

f.appendChild(c);

f.onwheel= (event) => {
captions[curr_thumb].scrollIntoView();
skip(event,video,t);
}

ifr.style.height=Math.ceil(thumbs.clientHeight*zm+15)+'px';

f.appendChild(pgs);
ct.innerHTML=format_time;
pgs.appendChild(pgb);
pgs.appendChild(ct);

captions.push(ct);
progresses.push(pgb);
ct.style.cssText+="transform: scale("+(0.18*(f.clientWidth/ct.clientWidth)).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+");";

try{
//if(!co_flg){
console.image(c.toDataURL(),f,ct,format_time,f);
//}
}catch(e){
	;
}


	video.scrollIntoView();



 
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