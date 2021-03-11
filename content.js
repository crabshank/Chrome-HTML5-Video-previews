try {
	let init=true;
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(window.location.href==request.message){
		if(init){
	 handleBrowserActionClicked(request.message);
		init=false;
		}
	}

	});
function handleBrowserActionClicked(srcUrl) {
let ifrm=document.createElement('iframe');
ifrm.style.setProperty( 'position', 'relative', 'important' );
ifrm.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
ifrm.style.setProperty( 'width', '-webkit-fill-available', 'important' );
ifrm.style.setProperty( 'margin', 0, 'important' );
ifrm.style.setProperty( 'border', 0, 'important' );
ifrm.style.setProperty( 'padding', 0, 'important' );

ifrm.style.setProperty( 'top', '0.37ch', 'important' );
ifrm.style.setProperty( 'left', '0.66ch', 'important' );

let ifrm2=document.createElement('iframe');
ifrm2.style.setProperty( 'position', 'relative', 'important' );
ifrm2.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
ifrm2.style.setProperty( 'width', '-webkit-fill-available', 'important' );
ifrm2.style.setProperty( 'height', '-webkit-fill-available', 'important' );
ifrm2.style.setProperty( 'margin', 0, 'important' );
ifrm2.style.setProperty( 'border', 0, 'important' );
ifrm2.style.setProperty( 'padding', 0, 'important' );
ifrm2.style.setProperty( 'min-height', '100vh', 'important' );

	let embeds=[];
	
function un_hider(bool){

let allNodes=[...document.querySelectorAll('*')];

	let vieChild=[];
allNodes.forEach(function(node) {
if(node.nodeName=='IFRAME' || node.nodeName=='EMBED' || node.nodeName=='VIDEO'){
		vieChild.push([...node.querySelectorAll('*')]);
	}
});
		vieChild=Array.from(new Set(vieChild));

if(bool){

	allNodes.forEach(function(node) {
			if(node.nodeName!=='IFRAME' && node.nodeName!=='EMBED' && node.nodeName!=='VIDEO'){
			if((node.getElementsByTagName('IFRAME').length===0 && node.getElementsByTagName('EMBED').length===0 && node.getElementsByTagName('VIDEO').length===0) && !vieChild.includes(node)){
				node.style.setProperty( 'display', 'initial', 'important' );
			}else{
				node.style.setProperty( 'background', 'initial', 'important' );
				node.style.setProperty( 'background-color', 'initial', 'important' );
			}
		}
	});

}else{
			
allNodes.forEach(function(node) {
	
	if(node.nodeName!=='IFRAME' && node.nodeName!=='EMBED' && node.nodeName!=='VIDEO'){
			if((node.getElementsByTagName('IFRAME').length===0 && node.getElementsByTagName('EMBED').length===0 && node.getElementsByTagName('VIDEO').length===0) && !vieChild.includes(node)){
				node.style.setProperty( 'display', 'none', 'important' );
			}else{
				node.style.setProperty( 'background', 'transparent', 'important' );
				node.style.setProperty( 'background-color', 'transparent', 'important' );
			}
		}
	
	if (node.nodeName==='VIDEO'){
		node.controls=true;
	}	
	if (node.nodeName==='EMBED'){
		embeds.push(node);
	}	
});
	
}
}

un_hider(false);

document.head.style.setProperty( 'visibility', 'visible', 'important' );
document.head.style.setProperty( 'display', 'block', 'important' );
document.body.style.setProperty( 'overflow-y', 'overlay', 'important' );
//document.body.style.setProperty( 'white-space', 'pre-wrap', 'important' );
//document.head.style.setProperty( 'pointer-events', '', 'important' );
//document.documentElement.style.setProperty( 'pointer-events', '', 'important' );
//hides all but vids in top level

//convert all embeds in top level, ~embeds~, and iframes -> iframes.

function emb_to_ifr(embeds){
embeds.forEach(function(node) {
	try{
		let rgx=new RegExp('<embed ', '');
		node.outerHTML=node.outerHTML.split(rgx).join('<iframe ');
	}catch(e){
		node.outerHTML='<iframe src="'+node.src+'"></iframe>';
	}
});
//return embeds;
}

emb_to_ifr(embeds);

let ht_a=`
<style>
input::-webkit-textfield-decoration-container {
    background: buttonface;
}
</style>
<main>
<button style="background-color: buttonface !important; visibility: initial !important;" id="three_plus" type="button">+ 3 thumbs</button>
<button style="background-color: buttonface !important; visibility: initial !important;" id="three_neg" type="button">- 3 thumbs</button>
<button style="background-color: buttonface !important; display: none; visibility: initial !important;" type="button" id="every"></button>
<button style="background-color: buttonface !important; visibility: initial !important;" id="clear_er" type="button">Clear</button>
<select style="width: 48.3vw; color: black; background-color: buttonface; visibility: initial !important;" name="txt_Bx" id="txt_Bx">
<option style="color: black !important visibility: initial !important;"></option>
</select>

<input style="background-color: buttonface !important; visibility: initial !important;" id="scnB" type="button" Value="Scan for video">
<input style="background-color: buttonface !important; visibility: initial !important;" id="genB" type="button" Value="Generate Thumbs"><br>
<span style="color: #dfdfdf !important; font-size: 1.83ch !important; visibility: initial !important;" id="frames" title="Scroll here to change number of frames.">24</span>
<span style="color: #dfdfdf !important; font-size: 1.83ch !important; margin-inline-start: 4.4ch !important; visibility: initial !important;" title="Maximum speed when speeding through; scroll to change.">Max speed: </span>
<input title="Maximum speed when speeding through; scroll to change." type="number" id="mxs" min="1" max="16" step="0.5" value="6" style="width: 9ch !important; background-color: buttonface !important; border-width: 0px !important; visibility: initial !important;"></input>
</main>
`;


let ht_c=`
<style>
progress::-webkit-progress-value {
    background-color: #00ffff8f;
}
progress::-webkit-progress-bar {
    background-color: #8080808f;
}
progress {
    position: absolute;
	border-radius: 0;
    height: 0.9em;
}
</style>

<section style="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;">
<div id="thumbs"><section style="display: inline-flex !important;"></section></div>
<section id="bSec" style="display: block !important; position: fixed !important; visibility:hidden !important; min-width: 10ch !important; width: 10ch !important; right: 2% !important;">	
<button id="scroll_curr" style="background-color: buttonface !important;">Scroll to current thumb</button>
<button id="scroll_vid" style="background-color: buttonface !important;">Scroll to video</button>
<button id="spdt" style="background-color: buttonface !important; min-height: 7ch; width: inherit;">Speed through video</button>
<button id="pnp" style="background-color: buttonface !important;">Toggle picture-in-picture</button>

<div id="currTime" style="color: white !important;background-color: black !important;font-size: 185% !important;font-weight: bold !important;text-align: center !important;"></div>
</section>
</section>
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
var mgLft=4;
var gapVid=9;
ifrm.contentWindow.document.body.style.setProperty( 'margin', 0, 'important' );
ifrm.contentWindow.document.body.style.setProperty( 'border', 0, 'important' );
ifrm.contentWindow.document.body.style.setProperty( 'padding', 0, 'important' );

ifrm2.contentWindow.document.body.style.setProperty( 'margin', 0, 'important' );
ifrm2.contentWindow.document.body.style.setProperty( 'border', 0, 'important' );
ifrm2.contentWindow.document.body.style.setProperty( 'padding', 0, 'important' );

var main=[...ifrm.contentWindow.document.getElementsByTagName("main")][0];
var sc1=[...ifrm2.contentWindow.document.getElementsByTagName("section")][0];main.style.setProperty( 'border', 0, 'important' );
main.style.setProperty( 'padding', 0, 'important' );



 
ifrm.height=main.clientHeight;

var frame_btn=[...ifrm.contentWindow.document.querySelectorAll("span#frames")][0];
var three_Plus=[...ifrm.contentWindow.document.querySelectorAll("button#three_plus")][0];
var three_Neg=[...ifrm.contentWindow.document.querySelectorAll("button#three_neg")][0];
var clrr=[...ifrm.contentWindow.document.querySelectorAll("button#clear_er")][0];
var mxsp=[...ifrm.contentWindow.document.querySelectorAll("input#mxs")][0];
var myVdo;
/*var thumbsA=[...document.body.querySelectorAll("div#thumbs")];
var scrlA= [...document.body.querySelectorAll("button#scroll_curr")];
var scrvA= [...document.body.querySelectorAll("button#scroll_vid")];
var spbA= [...document.body.querySelectorAll("button#spdt")];
var pipA= [...document.body.querySelectorAll("button#pnp")];
var currA  =[...document.body.querySelectorAll("div#currTime")];

var thumbs= thumbsA[thumbsA.length-1];
var scrl= scrlA[scrlA.length-1];
var scrv= scrvA[scrvA.length-1];
var spb= spbA[spbA.length-1];
var pip= pipA[pipA.length-1];
var curr= currA[currA.length-1];*/

var bSect=[...ifrm2.contentWindow.document.querySelectorAll("section#bSec")][0];

let sc1w=(bSect.getBoundingClientRect().left-mgLft).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});

 sc1.style.minWidth=sc1w+'px';
 sc1.style.width=sc1w+'px';
 sc1.style.maxWidth=sc1w+'px';

var thumbs=[...ifrm2.contentWindow.document.querySelectorAll("div#thumbs")][0];
var threeSct=thumbs.firstChild;
thumbs.style.setProperty( 'margin', 0, 'important' );
thumbs.style.setProperty( 'border', 0, 'important' );
thumbs.style.setProperty( 'padding', 0, 'important' );

var scrl= [...ifrm2.contentWindow.document.querySelectorAll("button#scroll_curr")][0];
var scrv= [...ifrm2.contentWindow.document.querySelectorAll("button#scroll_vid")][0];
var spb= [...ifrm2.contentWindow.document.querySelectorAll("button#spdt")][0];
var pip= [...ifrm2.contentWindow.document.querySelectorAll("button#pnp")][0];
var curr  =[...ifrm2.contentWindow.document.querySelectorAll("div#currTime")][0];

var evry= [...ifrm.contentWindow.document.querySelectorAll("button#every")][0];
var scanB= [...ifrm.contentWindow.document.querySelectorAll("input#scnB")][0];
var gnrB= [...ifrm.contentWindow.document.querySelectorAll("input#genB")][0];
var sp_swtch=0;

var txtBx = [...ifrm.contentWindow.document.querySelectorAll('select#txt_Bx')][0];
//var pgrCSS = [...ifrm2.contentWindow.document.querySelectorAll('style#pgrB')][0];
var vids=[];
var vhw={w:0,h:0};
var allFrames=[];

var rsz= ()=>{
	let tmbw=bSect.getBoundingClientRect().left-mgLft;
tmbw_f=tmbw.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});

 ifrm2.style.minWidth=Math.min(document.body.clientWidth,window.innerWidth)+'px';
 ifrm2.style.width=Math.min(document.body.clientWidth,window.innerWidth)+'px';
 ifrm2.style.maxWidth=Math.min(document.body.clientWidth,window.innerWidth)+'px';

 sc1.style.minWidth=tmbw_f+'px';
 sc1.style.width=tmbw_f+'px';
 sc1.style.maxWidth=tmbw_f+'px';

 thumbs.style.minWidth=tmbw_f+'px';
 thumbs.style.width=tmbw_f+'px';
 thumbs.style.maxWidth=tmbw_f+'px';
 

let scts=[...thumbs.children];


for(let j = 0; j < scts.length; j++){

let figs=[...scts[j].children];

sctPrp=(figs.length==0)?tmbw:tmbw/figs.length;
sctPrp_f=sctPrp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});

let sctW=0;
for (let i = 0; i < figs.length; i++) {
	sctW+=figs[i].scrollWidth;
}
fPrp=(sctW==0)?1:(tmbw/(sctW/figs.length))*(1/3);
fPrp_f=fPrp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});
scts[j].style.zoom=fPrp_f;


}
	
}


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
			let fct=parseFloat(captions[ix].parentElement.parentElement.parentElement.style.zoom);
			 progresses[ix].value=(ev.offsetX / ((rct.right-rct.left)*fct));
			 myVdo.currentTime=(progresses[ix].value)*(nxt-cur)+cur;
			 curr_thumb=ix;
}
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
	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	}
}


function shiftBtns(bool){
	pip.style.top=Math.min(curr.getBoundingClientRect().top-23,myVdo.clientHeight)+'px';
	//curr.style.top=(parseFloat(pip.style.top)+4)+'px';
	if(bool){
	spb.style.top=(pip.getBoundingClientRect().top-pip.getBoundingClientRect().height-2)+'px';
	scrv.style.top=(spb.getBoundingClientRect().top-spb.getBoundingClientRect().height-2)+'px';
	scrl.style.top=(scrv.getBoundingClientRect().top-scrv.getBoundingClientRect().height-2)+'px';
	}
}

//shiftBtns(true);
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

rsz();

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
		mxsp.value=(Math.max(1,mxsp.valueAsNumber-parseFloat(mxsp.step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});
		adjRate();
	}
	if (event.deltaY<0){
		mxsp.value=(Math.min(16,mxsp.valueAsNumber+parseFloat(mxsp.step))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});
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

function ifrScan()
{	

	function getContainedFrames(f){
		if(!!f.contentWindow && typeof f.contentWindow !=='undefined'){
			return f.contentWindow.window.frames;
		}else{
			return null;
		}
	}
	
		vids=[];
		allFrames=[];
		let gene=0;
		let vids0=[...document.documentElement.getElementsByTagName('VIDEO')]; 
		for (let k=0; k<vids0.length; k++){
			vids.push([vids0[k],'']);
		}


	let frms=[...document.documentElement.getElementsByTagName('IFRAME')]; 
	
		if(!!frms && frms.length>0){
		for (let k=0; k<frms.length; k++){
			allFrames.push([frms[k],1,',f'+gene+',']);
			gene++;
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
			allFrames.push([frms1[k],1,allFrames[j][2]+',f'+gene+',']);
			gene++;
		}
	}
}
}
}
}
	for (let j=0; j<allFrames.length; j++){
		let vids1=[];
		if(!!allFrames[j][0].document && typeof allFrames[j][0].document!=='undefined'){
		vids1=[...allFrames[j][0].document.documentElement.getElementsByTagName('VIDEO')]; 
		}else if(!!allFrames[j][0].contentDocument && typeof allFrames[j][0].contentDocument!=='undefined'){
			vids1=[...allFrames[j][0].contentDocument.documentElement.getElementsByTagName('VIDEO')]; 
		}
		for (let k=0; k<vids1.length; k++){
			vids.push([vids1[k],allFrames[j][2]]);
		}
	}
	
		let filt_vid=[];
		for (let k=0; k<vids.length; k++){
			if(!!isFinite(vids[k][0].duration)){
				filt_vid.push([vids[k][0],vids[k][1]]);
			}
		}	
		
		vids=[];
		for (let k=0; k<filt_vid.length; k++){
			vids.push(filt_vid[k]);
		}

	txtBx.innerHTML='<option style="color: black !important"></option>';
	let pxs=0;
	let drt=0;
	  vids.forEach((vid,index) => {
    let opt = document.createElement('option');
	opt.setAttribute("index", index);
	opt.style.cssText='color: black !important;';
    opt.textContent = '('+formatTime(vid[0].duration)+') - '+vidSrc(vid[0]);
	    txtBx.appendChild(opt);	
		let pixs=vid[0].videoWidth*vid[0].videoHeight;
		if(pixs>pxs)
		{
			pxs=pixs;
			txtBx.selectedIndex =txtBx.length-1;
		}else if(pixs==pxs){
			if(vid[0].duration>drt){
			drt=vid[0].duration;
			txtBx.selectedIndex =txtBx.length-1;
			}
		}
		   
		   tbG=false;
		   gnrB.value='Select video';
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
		let myVdo_el=vids[parseInt(txtBx[txtBx.selectedIndex].getAttribute('index'))];
		myVdo=myVdo_el[0];
		shiftBtns(true);
		bSect.style.visibility='visible';
		/*pip.style.visibility='visible';
		spb.style.visibility='visible';
		scrv.style.visibility='visible';
		scrl.style.visibility='visible';
		curr.style.visibility='visible';*/
		thumbs.style.visibility='visible';
		let vrc= myVdo.getBoundingClientRect();
		ifrm2.style.setProperty( 'top', (vrc.bottom+gapVid)+'px', 'important' );
		let ifr2c=ifrm2.getBoundingClientRect();
		if(ifr2c.top>vrc.bottom){
			ifrm2.style.setProperty( 'top', (parseFloat(ifrm2.style.top)-(ifr2c.top-vrc.bottom)+gapVid)+'px', 'important' );
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
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	}
}
			

myVdo.ondurationchange= () => {
	un_hider(true);
  checkDur();
}

myVdo.onloadedmetadata= () => {
  checkDur();
}
  
   myVdo.onratechange =function() {
	if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	}
	if(myVdo.readyState>2){
	calcSp();
	}
 }			
		
		 allFrames.forEach((frame,index) => {
			if(!myVdo_el[1].includes(frame[2]) && myVdo_el[1]!='' && frame[0]!==ifrm && frame[0]!==ifrm2){
			frame[0].style.setProperty( 'display', 'none', 'important' );
			}else{
				//node.style.setProperty( 'pointer-events', '', 'important' );
			}
		 });
		
		
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
		thumbs.innerHTML = '<section style="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;"></section>';
		threeSct=thumbs.firstChild;
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




function doThumbs()
{
	
if (loadFlag===true){
	 done_t=t;
captions=[];
progresses=[];

	ttmp=0;
	thumbs.innerHTML =  '<section style="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;"></section>';
	threeSct=thumbs.firstChild;
	myVdo.pause();
	myVdo.currentTime = 0;

aseek=1;

if(!tTrkFlg){
curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
}

 myVdo.ontimeupdate= () => {
	if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
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
			//myVdo.style.height=(10000*(vhw.h/(vhw.w+vhw.h))/80).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"vw";
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
				rsz();
				window.scrollTo(0,0);
				
				window.onscroll=()=>{
				let a= window.scrollY-ifrm2.offsetTop;
				
				if(a>=0){
					bSect.style.top=(a+3)+'px';
				}
					
				}
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

var f = ifrm2.contentWindow.document.createElement("figure");
var ct=ifrm2.contentWindow.document.createElement("figcaption");
var pgs=ifrm2.contentWindow.document.createElement("section");
var pgb=ifrm2.contentWindow.document.createElement("progress");
pgb.max=1;
pgb.value=0;
pgb.title='0.0%';
pgb.style.display='none';
pgs.style.display='contents';
pgs.style.width='inherit';
pgs.style.position='absolute';
var c = ifrm2.contentWindow.document.createElement("canvas");

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



let ifw=Math.min(document.body.clientWidth,window.innerWidth);
ifrm2.style.setProperty=('min-width',ifw+'px','important');
ifrm2.style.setProperty=('width',ifw+'px','important');
ifrm2.style.setProperty=('max-width',ifw+'px','important');



shiftBtns(true);

if (threeSct.children.length==3){
	threeSct=ifrm2.contentWindow.document.createElement("section");
	thumbs.appendChild(threeSct);
	threeSct.style.cssText="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;";
	
}
threeSct.appendChild(f);

f.style.setProperty( 'margin', 0, 'important' );
f.style.setProperty( 'border', 0, 'important' );
f.style.setProperty( 'padding', 0, 'important' );

f.appendChild(c);



f.appendChild(pgs);
ct.innerHTML=format_time;
pgs.appendChild(pgb);
pgs.appendChild(ct);
captions.push(ct);
progresses.push(pgb);
f.style.cssText="display: inline-grid !important; margin: 0 0 0 0 !important;";
ct.style.cssText+="color: white  !important; font-size: 169%  !important; display: inline-table !important; position: absolute !important; transform-origin: top left !important; font-family: Microsoft JhengHei UI !important";




//ct.style.setProperty( 'transform', 'scale('+().toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+')', 'important' );

ct.style.setProperty( 'transform', 'scale('+(2.34)+')', 'important' );

pgb.style.width=window.getComputedStyle(f).width;

rsz();

f.onwheel= (event) => {
captions[curr_thumb].parentElement.parentElement.scrollIntoView();
skip(event);
}

  f.onclick= function(){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	  if(window.getComputedStyle(progresses[index]).display==='none'){
	nowFlag=index;
	cap=index;
	myVdo.currentTime =c.attributes.timestamp.nodeValue;
if(!myVdo.ownerDocument.pictureInPictureElement){
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
if(!myVdo.ownerDocument.pictureInPictureElement){
		myVdo.scrollIntoView();
}
	  }
	  window.getSelection().removeAllRanges();
} 



}
  
}else{
alert('Video not loaded!');
}

}

}

document.head.insertAdjacentElement('afterbegin',ifrm);
ifrm.src = "about:blank";

ifrm.contentWindow.document.open();
ifrm.contentWindow.document.write(ht_a);
ifrm.contentWindow.document.close();

document.body.insertAdjacentElement('beforeend',ifrm2);
ifrm2.src = "about:blank";

ifrm2.contentWindow.document.open();
ifrm2.contentWindow.document.write(ht_c);
ifrm2.contentWindow.document.close();

pageScript();

}


} catch (e) {	
  console.error(e);
}