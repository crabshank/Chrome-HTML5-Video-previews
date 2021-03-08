try {
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(window.location.href==request.message){
	 handleBrowserActionClicked(request.message);
	}

	});
function handleBrowserActionClicked(srcUrl) {

let ht_a=`
<head>
</head> 

<body>

<style>
iframe{
	width: 80vw; 
	height: 45vw; 
	border-width: 0px;
	margin: 0 0 0 0;
    padding: 0 0 0 0;
}
video::-webkit-media-controls {
    zoom: 131%;
}
figcaption {
color: white;
    font-size: 169%;
    display: inline-table;
    position: absolute;
    transform-origin: top left;
    font-family: Microsoft JhengHei UI;
}
div#thumbs>figure {
    display: inline-grid;
		margin: 0 0 0 0;
}
button, input[type="button"]{
	background-color: buttonface;
}

body{
background-color: #333;
}

span{
color: #dfdfdf;
font-size: 1.83ch;
}

input::-webkit-textfield-decoration-container {
    background: buttonface;
}
progress::-webkit-progress-value {
    background-color: #00ffff8f;
}
progress::-webkit-progress-bar {
    background-color: #8080808f;
}
</style>

<style id="pgrB">
progress {
    position: absolute;
	border-radius: 0;
    height: 0.9em;
}
</style>

<button id="three_plus" type="button">+ 3 thumbs</button>
<button id="three_neg" type="button">- 3 thumbs</button>
<button type="button" id="every" style="display: none;"></button>
<button id="clear_er" type="button">Clear</button>
<select style="width: 50.1vw; color: black; background-color: buttonface;" name="txt_Bx" id="txt_Bx"><option style="color: black"></option></select>

<input id="scnB" type="button" Value="Scan for video">
<input id="genB" type="button" Value="Generate Thumbs"><br>
<span id="frames" title="Scroll here to change number of frames.">24</span>
<span style="margin-inline-start: 4.4ch;" title="Maximum speed when speeding through; scroll to change.">Max speed: </span>
<input title="Maximum speed when speeding through; scroll to change." type="number" id="mxs" min="1" max="16" step="0.5" value="6" style="width: 9ch; background-color: buttonface; border-width: 0px;"></input>

<div style="width:90vw; text-align:center;">
`;

let ht_b='<iframe id="video" src="'+srcUrl+'"></iframe>';


let ht_c=`
<button id="scroll_curr" style="position: fixed; margin-left: 1px; visibility: hidden;">Scroll to current thumb</button>
<button id="scroll_vid" style="position: fixed; margin-left: 1px;">Scroll to video</button>
<button id="spdt" style="position: fixed; margin-left: 1px;">Speed through video</button>
<button id="pnp" style="position: fixed; margin-left: 1px;">Toggle picture-in-picture</button>

<div id="currTime" style="position: fixed; bottom: 0.17%; right: 0.73%; color: white; background-color: black; font-size: 185%; font-weight: bold; transform: scale(1.2); transform-origin: bottom right;"></div>

<div id="thumbs"style="margin-block-start: 0.1%;"></div></div>
`;

function pageScript(){
var clck_a=-1;
var t_a=0;
var t_b=0;
var clck_b=0;
var m_c=0;
var m_l=0;
var curr_thumb=0;
var t=24;
var done_t=t;
var loadFlag=false;
var nowFlag=-1;
var aseek=0;
var captions=[];
var progresses=[];
var ttmp=0;
var cap=-1;
var cap_el;
var time_track=-1;
var tTrkFlg=false;
var ev_t=-1;
var mx=-3000;
var perc_r;
var perc;
var tbG=false;
var frame_btn=[...document.querySelectorAll("span#frames")][0];
var three_Plus=[...document.querySelectorAll("button#three_plus")][0];
var three_Neg=[...document.querySelectorAll("button#three_neg")][0];
var clrr=[...document.querySelectorAll("button#clear_er")][0];
var mxsp=[...document.querySelectorAll("input#mxs")][0];
var thumbs=[...document.querySelectorAll("div#thumbs")][0];
var ifrm = [...document.querySelectorAll("iframe#video")][0];	
var myVdo = [...document.querySelectorAll("iframe#video")][0];	
var scrl= [...document.querySelectorAll("button#scroll_curr")][0];
var scrv= [...document.querySelectorAll("button#scroll_vid")][0];
var spb= [...document.querySelectorAll("button#spdt")][0];
var pip= [...document.querySelectorAll("button#pnp")][0];
var evry= [...document.querySelectorAll("button#every")][0];
var scanB= [...document.querySelectorAll("input#scnB")][0];
var gnrB= [...document.querySelectorAll("input#genB")][0];
var sp_swtch=0;
var curr  =[...document.querySelectorAll("div#currTime")][0];
var txtBx = [...document.querySelectorAll('select#txt_Bx')][0];
var pgrCSS = [...document.querySelectorAll('style#pgrB')][0];
var vids=[];
var vhw={w:0,h:0};
var allFrames=[];

clrr.onclick=()=>{
	clr();
}

evry.onclick=()=>{
	setEveryFrames();
}

three_Plus.onclick=()=>{
	setPlusFrames();
}

three_Neg.onclick=()=>{
	setMinusFrames();
}

scanB.onclick=()=>{
	ifrScan();
}

gnrB.onclick=()=>{
	changeValue();
}

function vidSrc(vid){
	if (vid.src !== "") {
		return vid.src;
	} else if (vid.currentSrc !== "") {
		return vid.currentSrc;
	}else{
		return '';
	}
}

function pgBar(ix,ths,ev,attr,nxt){
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
			
			

function shiftBtns(bool){
	pip.style.top=Math.min(curr.getBoundingClientRect().top-23,myVdo.clientHeight)+'px';
	if(bool){
	spb.style.top=(pip.getBoundingClientRect().top-pip.getBoundingClientRect().height-2)+'px';
	scrv.style.top=(spb.getBoundingClientRect().top-spb.getBoundingClientRect().height-2)+'px';
	scrl.style.top=(scrv.getBoundingClientRect().top-scrv.getBoundingClientRect().height-2)+'px';
	}
}

shiftBtns(true);
function calcSp(){
if(sp_swtch==1 && aseek==0 && mxsp.valueAsNumber>1 && !myVdo.paused){ 
if(clck_a==-1){
		t_a=myVdo.currentTime;
	clck_a = performance.now();
}else{
let c_i=myVdo.currentTime;
clck_b = performance.now();
for (let i=myVdo.buffered.length-1; i>=0; i--){	
let t_i=myVdo.buffered.end(i);
let s_i=myVdo.buffered.start(i);
if(c_i<=t_i && c_i>=s_i){
	if(t_i>t_a){
		lst=Math.floor((100000*((t_i-t_a)/(clck_b-clck_a))))*0.01;
		t_a=t_i;
		myVdo.playbackRate=Math.min(mxsp.value,Math.max(1,lst));
	}else{
		t_a=c_i
	}
	clck_a=performance.now();
	break;
}else if(c_i>t_i){
	break;
}

}
}

}
}

function adjRate(){
if(sp_swtch==1){
myVdo.playbackRate=Math.min(16,Math.max(1,mxsp.valueAsNumber));
calcSp();
}
}

function skip(event) {
event=(event.originalEvent)?event.originalEvent:event;
event.preventDefault();
event.stopPropagation();
if(event.deltaY>0){
   myVdo.currentTime -= (myVdo.duration/t)*0.05;
}
if (event.deltaY<0){
	myVdo.currentTime +=  (myVdo.duration/t)*0.05;
}
}


window.addEventListener('resize', function () {
let factor= ((100/3)*(ifrm.clientWidth/vhw.w));
thumbs.style.zoom=factor.toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"%";
shiftBtns(true);
});


function formatTime(seconds,precise) {
var minutes = Math.floor(seconds / 60);
var secs = seconds % 60;
let floorSecs =Math.floor(secs);
if (typeof precise!=='undefined'){
	minutes +="m";
if(precise==1){
secs =Math.ceil((secs-floorSecs) *10);
secs=(secs==10)?" "+(floorSecs+1)+".0s":" "+floorSecs+"."+Math.max(0,secs).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 0})+"s";
}else if(precise==2){
	secs =Math.ceil((secs-floorSecs) *1000);
	secs=(secs==1000)?" "+(floorSecs+1)+"s 0ms":" "+floorSecs+"s "+Math.max(0,secs).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 0})+"ms";
	}
}else{
	minutes=(minutes < 10) ? "0" + minutes: minutes;
	secs = (floorSecs < 10) ? ":0" + floorSecs:":"+floorSecs ;
}

	return minutes + secs;
  }

scrl.onclick=function(){
captions[curr_thumb].parentElement.parentElement.scrollIntoView();
};

scrv.onclick=function(){
myVdo.scrollIntoView();
};

mxsp.onwheel= (event) => {
	event.preventDefault();
	event.stopPropagation();
	
	if(event.deltaY>0){
		mxsp.value=(Math.max(1,mxsp.valueAsNumber-parseFloat(mxsp.step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		adjRate();
	}
	if (event.deltaY<0){
		mxsp.value=(Math.min(16,mxsp.valueAsNumber+parseFloat(mxsp.step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7});
		adjRate();
		}
	}
	
	mxsp.onchange= (event) => {
		adjRate();
	}	
	mxsp.oninput= (event) => {
		adjRate();
	}
	mxsp.onkeyup= (event) => {
		adjRate();
	}
	mxsp.onkeydown= (event) => {
		adjRate();
	}

myVdo.onwheel= (event) => {
skip(event);
}


myVdo.onprogress= () => {
if(myVdo.readyState>2){
calcSp();
}else{
myVdo.playbackRate=1;
}
}


myVdo.onplay= () => {
if(myVdo.readyState>2){
calcSp();
}else{
myVdo.playbackRate=1;
}
}


myVdo.onseeked= () => {
t_a=myVdo.currentTime;
if(myVdo.readyState>2){
calcSp();
}else{
myVdo.playbackRate=1;
}
}

 myVdo.ontimeupdate= () => {
	if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x)";
	}
}

spb.onclick=function(){
if(sp_swtch==0){
sp_swtch=1;
adjRate();
spb.innerText="Play at 1x";
}else{
myVdo.playbackRate=1;
sp_swtch=0;
spb.innerText="Speed through video";
}
};

frame_btn.onwheel= (event) => {

event.preventDefault();
event.stopPropagation();

if(event.deltaY>0){
setMinusFrames();
}
if (event.deltaY<0){
setPlusFrames();
}

}



	function setPlusFrames() {
	if (aseek==0){
			t += 3;
			frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			if(ev_t>-1 && t!=ev_t){
				evry.style.display='initial';
			}else{
				evry.style.display='none';
			}
			}
	}

	function setMinusFrames() {
		if (aseek==0){
		t=(t<6)?3:t-3;
		frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			if(ev_t>-1 && t!=ev_t){
				evry.style.display='initial';
			}else{
				evry.style.display='none';
			}
		}
	}	
	
	function setEveryFrames() {
		if (aseek==0){
			if(myVdo.duration>=270){
			t=Math.round(Math.ceil(myVdo.duration/90)*3);
			frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;			
			}else if(myVdo.duration<4.5){
				t=Math.round(Math.Max(1,Math.floor((myVdo.duration*2)/3))*3);
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			}else{
			t=9;
			frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			}
			if(ev_t>-1 && t!=ev_t){
				evry.style.display='initial';
			}else{
				evry.style.display='none';
			}
		}
	}

function clr(){
document.getElementById('txtBx').value="";
}


	
var checkDur = function() {
	if(!!isFinite(myVdo.duration)){
	loadFlag=true;
	nowFlag=-1;	
	shiftBtns(true);
			if(ev_t==-1){
			if(myVdo.duration>=270){
			t=Math.round(Math.ceil(myVdo.duration/90)*3);
			frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			evry.innerText='At least every 30 secs';
			}else if(myVdo.duration<4.5){
				t=Math.round(Math.Max(1,Math.floor((myVdo.duration*2)/3))*3);
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
				evry.innerText='At most every 0.5 secs';
			}else{
			t=9;
			frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			evry.innerText='9 frames';
			}
			ev_t=t;
			}
	}
	
	myVdo.pause();
	myVdo.currentTime=0;

	if(!tTrkFlg){
	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x)";
	}
}

function ifrScan()
{	

	function getContainedFrames(f){
		if(typeof f.contentWindow !=='undefined'){
			return f.contentWindow.window.frames;
		}else{
			return null;
		}
	}
	
		vids=[];
		allFrames=[];
		let vids0=[...ifrm.contentDocument.getElementsByTagName('VIDEO')]; 
		for (let k=0; k<vids0.length; k++){
			vids.push(vids0[k]);
		}


	let frms=getContainedFrames(ifrm); 
	
		if(!!frms && frms.length>0){
		for (let k=0; k<frms.length; k++){
			allFrames.push([frms[k],1]);
		}
		}

if(allFrames.length>0){
while(allFrames.map(function(v){return v[1]}).reduce(function(a,b) {return a + b})>0){
	for (let j=0; j<allFrames.length; j++){
		if(allFrames[j][1]==1){
	let frms1=getContainedFrames(allFrames[j][0]); 
	allFrames[j][1]=0;
	if(!!frms1 && frms1.length>0){
	for (let k=0; k<frms1.length; k++){
			allFrames.push([frms1[k],1]);
		}
	}
}
}
}
}
	for (let j=0; j<allFrames.length; j++){
		let vids1=[...allFrames[j][0].document.getElementsByTagName('VIDEO')]; 
		for (let k=0; k<vids1.length; k++){
			vids.push(vids1[k]);
		}
	}
	
	
	

	
	
	txtBx.innerHTML='<option style="color: black"></option>';
	let pxs=0;
	  vids.forEach((vid,index) => {
		  if(!!isFinite(vid.duration)){
    let opt = document.createElement('option');
	opt.setAttribute("index", index);
	opt.style.cssText='color: black;';
    opt.textContent = '('+formatTime(vid.duration)+') - '+vidSrc(vid);
	    txtBx.appendChild(opt);	
		   txtBx.selectedIndex = (vid.videoWidth*vid.videoHeight>pxs)?txtBx.length-1:txtBx.selectedIndex;
		   tbG=false;
		   gnrB.value='Select video';
		  }

  });
}

function changeValue()
{
	if(txtBx.length>1){
		if(!tbG){
		curr_thumb=0;
		loadFlag=false;
		ttmp=0;
		ev_t=-1;
		/*let txtVal=txtBx.value;
		alert(txtVal);  
		vid.src = txtVal;      
		myVdo.load(); 
		myVdo.pause();*/
		myVdo=vids[parseInt(txtBx[txtBx.selectedIndex].getAttribute('index'))];
		
		pip.onclick=function(){
		if (myVdo.ownerDocument.pictureInPictureElement) {
		myVdo.ownerDocument.exitPictureInPicture();
		} else {
		if (myVdo.ownerDocument.pictureInPictureEnabled) {
		myVdo.requestPictureInPicture();
		}
		}
		};
		
		captions=[];
		progresses=[];
		curr_thumb=0;
		thumbs.innerHTML="";
		scrl.style.visibility='hidden';
		shiftBtns(true);
		checkDur();
		tbG=true;
		gnrB.value='Generate thumbs';
		}else{
		tbG=false;
		doThumbs();
		}
	}
}

myVdo.ondurationchange= () => {
  checkDur();
}

myVdo.onloadedmetadata= () => {
  checkDur();
}
  
   myVdo.onratechange =function() {
	if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x)";
	}
	if(myVdo.readyState>2){
	calcSp();
	}
 }


function doThumbs()
{
	
if (loadFlag===true){
	 done_t=t;
captions=[];
progresses=[];

	ttmp=0;
	thumbs.innerHTML = "";
	myVdo.pause();
	myVdo.currentTime = 0;

aseek=1;

if(!tTrkFlg){
curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x)";
}

 myVdo.ontimeupdate= () => {
	if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"x)";
	}
 if(aseek==0){
	for(let i=0;i<captions.length;i++){
	captions[i].style.display='inline-table';
	captions[i].innerText=captions[i].parentElement.parentElement.firstChild.attributes.timestamp_fmt.nodeValue;
	captions[i].style.backgroundColor="#00000099";
	}
	
		for(let i=0;i<progresses.length;i++){
		progresses[i].style.display='none';
		}
		
	cap=(cap!=-1)?cap:myVdo.currentTime*(done_t)/myVdo.duration;
	cap_el=Math.floor(cap);
	perc_r=Math.min(1,Math.max(0,cap-cap_el));
	perc=(perc_r*100).toLocaleString('en-GB', {minimumFractionDigits: 1, maximumFractionDigits: 1});

	
if(captions.length==done_t){

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
			pgBar(nowFlag,progresses[nowFlag],e,attr,attr_next.timestamp.nodeValue);
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
			pgBar(cap_el,progresses[cap_el],e,attr,attr_next.timestamp.nodeValue);
			}
	}else{
		var until=(cap_el<captions.length)?Math.max(0,attr_next.timestamp.nodeValue-myVdo.currentTime):Math.max(0,myVdo.duration-myVdo.currentTime);
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
			pgBar(cap_el,progresses[cap_el],e,attr,attr_next.timestamp.nodeValue);
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
			pgBar(nowFlag,progresses[nowFlag],e,attr,video.duration);
			}
	}else if (cap==cap_el){
		if(cap_el>=captions.length){
			//captions[captions.length-1].innerText=attr.timestamp_fmt.nodeValue+" (LAST) ["+100+".0%]";
			captions[captions.length-1].style.display="none";
			progresses[captions.length-1].style.display="";
			progresses[captions.length-1].title="100.0%";
			curr_thumb=captions.length-1;
			captions[captions.length-1].style.backgroundColor="#006115c7";	
			progresses[captions.length-1].value=1;
			captions[captions.length-1].parentElement.parentElement.onmousemove=function (e) {
			pgBar(captions.length-1,progresses[captions.length-1].value,e,attr,myVdo.duration);
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
			pgBar(cap_el,progresses[cap_el],e,attr,myVdo.duration);
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
			pgBar(captions.length-1,progresses[captions.length-1],e,attr,myVdo.duration);
			}
	}
		
}
}
cap=-1;
}
 }

/*myVdo.onloadeddata= function() {

}*/

	let gtmv = setInterval(getMoving, (Math.abs(mx)+1));
	
	function getMoving(){
		let p_n=performance.now();
		let df=p_n-t_b;
		if(df>mx){
			myVdo.play();
			t_a=p_n;
			t_b=p_n;
			mx=df;
		}
	}
	
function endGtMv() {
  clearInterval(gtmv);
}
 
function thumbseek(bool){
	if(bool){
		if(!((ttmp==0)&&(myVdo.readyState<2))){
			t_a=performance.now();
			if(!myVdo.paused){
			myVdo.pause();
			}
			time_track =ttmp*(myVdo.duration/t);
			vhw.h=myVdo.videoHeight;
			vhw.w=myVdo.videoWidth;
			ifrm.style.height=(10000*(vhw.h/(vhw.w+vhw.h))/80).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"vw";
			generateThumbnail();
			ttmp++;
			if (ttmp<done_t) {
			t_b=performance.now();
			let tm=t_b-t_a;
			mx=(tm>mx)?tm:mx;
			tTrkFlg=true;
			curr.innerText= formatTime(myVdo.currentTime)+"\n"+ttmp+"/"+done_t;
			myVdo.currentTime = ttmp*(myVdo.duration/t);
			}else {
				endGtMv();
				aseek=0;
				tTrkFlg=false;
				time_track=-1;
				ttmp=0;
				myVdo.currentTime=0;
				shiftBtns(false);
				scrl.style.visibility='';
				window.scrollTo(0,0);
			}
		}
		 
	}else{
		nowFlag=-1;
	}


}
 
myVdo.onseeking=function(){
	if((aseek==1)&&(myVdo.readyState>=2)&&(myVdo.currentTime>time_track)){  
		thumbseek(true);
	}else{
		thumbseek(false);
	}
}

myVdo.onwating=function(){
myVdo.playbackRate=1;
	if((aseek==1)&&(myVdo.readyState>=2)&&(myVdo.currentTime>time_track)){  
		thumbseek(true);
	}else{
		thumbseek(false);
	}
} 

myVdo.onseeked= function(){
t_a=myVdo.currentTime;
if(myVdo.readyState>2){
calcSp();
}else{
myVdo.playbackRate=1;
}

	if((aseek==1)&&(myVdo.currentTime>time_track)){  
		thumbseek(true);
	}else{
		thumbseek(false);
	}
}
 
function generateThumbnail() {

var f = document.createElement("figure");
var ct=document.createElement("figcaption");
var pgs=document.createElement("section");
var pgb=document.createElement("progress");
pgb.max=1;
pgb.value=0;
pgb.title='0.0%';
pgb.style.display='none';
pgs.style.display='contents';
pgs.style.width='inherit';
pgs.style.position='absolute';
var c = document.createElement("canvas");

f.onwheel= (event) => {
captions[curr_thumb].parentElement.parentElement.scrollIntoView();
skip(event);
}


var ctx = c.getContext("2d");

let v_width = vhw.w;
let v_height = vhw.h;

c.width= v_width;
c.height=v_height;   

f.style.width= v_width;
f.style.height=v_height;

c.setAttribute('timestamp', myVdo.currentTime);
let format_time=formatTime(myVdo.currentTime);
c.setAttribute('timestamp_fmt', format_time);

ctx.drawImage(myVdo, 0, 0, v_width, v_height);

  f.onclick= function(){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	  if(window.getComputedStyle(progresses[index]).display==='none'){
	nowFlag=index;
	cap=index;
	myVdo.currentTime =c.attributes.timestamp.nodeValue;
if(!document.pictureInPictureElement){
		myVdo.scrollIntoView();
}
	  }
} 

 f.ondblclick=  function(e){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	  if(window.getComputedStyle(progresses[index]).display!=='none'){
	nowFlag=index;
	cap=index;
	myVdo.currentTime =c.attributes.timestamp.nodeValue;
if(!document.pictureInPictureElement){
		myVdo.scrollIntoView();
}
	  }
	  window.getSelection().removeAllRanges();
} 

let factor=((100/3)*(ifrm.clientWidth/v_width));
thumbs.style.zoom=factor.toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+"%";
shiftBtns(true);
thumbs.appendChild(f);

f.appendChild(c);
f.appendChild(pgs);
ct.innerHTML=format_time;
pgs.appendChild(pgb);
pgs.appendChild(ct);
captions.push(ct);
progresses.push(pgb);
ct.style.cssText+="transform: scale("+(0.18*(f.clientWidth/ct.clientWidth)).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7})+");";
pgrCSS.innerText="progress{ width:"+window.getComputedStyle(f).width+"; position: absolute; border-radius: 0; height: 0.9em;";
}
  
}else{
alert('Video not loaded!');
}

}

}


document.body.parentElement.innerHTML=ht_a+ht_b+ht_c+'</body>';
pageScript();

}


} catch (e) {	
  console.error(e);
}