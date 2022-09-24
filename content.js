try {
	//console.log(window.location.href+" - 'HTML5 Video previews page' has access");
	let expnd=[];
	let exBool=true;

let init=true;

var g_ancestors=[];
var firstAncestor=null;
var firstParent=null;
var vfr=false;

function getTagNameShadow(docm, tgn){
var shrc=[docm];
var shrc_l=1;

let srCnt=0;

while(srCnt<shrc_l){
	allNodes=[shrc[srCnt],...shrc[srCnt].querySelectorAll('*')];
	for(let i=0, len=allNodes.length; i<len; i++){
		if(!!allNodes[i] && typeof allNodes[i] !=='undefined' && allNodes[i].tagName===tgn && i>0){
			shrc.push(allNodes[i]);
		}

		if(!!allNodes[i].shadowRoot && typeof allNodes[i].shadowRoot !=='undefined'){
			let c=allNodes[i].shadowRoot.children;
			shrc.push(...c);
		}
	}
	srCnt++;
	shrc_l=shrc.length;
}
	shrc=shrc.slice(1);
	let out=shrc.filter((c)=>{return c.tagName===tgn;});
	
	return out;
}

function getScreenWidth(mx){
	let w=[
					//document?.documentElement?.scrollWidth,
					//document?.body?.parentNode?.scrollWidth,
					//document?.body?.scrollWidth,
					//document?.head?.scrollWidth,
					//window.screen.availWidth,
					//window.screen.width,
					document?.documentElement?. clientWidth,
					document?.body?.parentNode?. clientWidth,
					document?.body?. clientWidth,
					document?.head?. clientWidth,
					document?.documentElement?. offsetWidth,
					document?.body?.parentNode?. offsetWidth,
					document?.body?. offsetWidth,
					document?.head?. offsetWidth
				].filter( (d)=>{return d>0} );
				
		if(w.length>0){
				if(mx){	
					return Math.max(...w);
				}else{
					return Math.min(...w);
				}
			}else{
				return 0;
			}
}

function getScreenHeight(mx){
	let h=[
					document?.documentElement?.scrollHeight,
					document?.body?.parentNode?.scrollHeight,
					document?.body?.scrollHeight,
					document?.head?.scrollHeight,
					window.screen.availHeight,
					window.screen.height,
					document?.documentElement?. clientHeight,
					document?.body?.parentNode?. clientHeight,
					document?.body?. clientHeight,
					document?.head?. clientHeight,
					document?.documentElement?. offsetHeight,
					document?.body?.parentNode?. offsetHeight,
					document?.body?. offsetHeight,
					document?.head?. offsetHeight
				];
				
				if(!!firstAncestor){
					h.push(absBoundingClientRect(firstAncestor).bottom);
				}
				
				h.filter( (g)=>{return g>0} );
				
			if(h.length>0){
				if(mx){
					return Math.max(...h);
				}else{
					return Math.min(...h);
				}
			}else{
				return 0;
			}
}



function setScrollY(y,dlt){	
						let t = [		window?.pageYOffset,
											window?.scrollY,
											document?.documentElement?.scrollTop,
											document?.body?.parentNode?.scrollTop,
											document?.body?.scrollTop,
											document?.head?.scrollTop,
											0
										].filter( (p)=>{return p>=0} );
										
	let mx=Math.max(...t);
	let ix = t.indexOf(mx);
	let dfy=(dlt)?y:y-mx;
	
	if(ix<2){
		window.scrollBy(0,dfy);
	}else if(ix==2){
		document.documentElement.scrollBy(0,dfy);
	}else if(ix==3){
		document.body.parentNode.scrollBy(0,dfy);
	}else if(ix==4){
		document.body.scrollBy(0,dfy);
	}else if(ix==5){
		document.head.scrollBy(0,dfy);
	}

}	

function getScrollY(){					
	let t = [		window?.pageYOffset,
											window?.scrollY,
											document?.documentElement?.scrollTop,
											document?.body?.parentNode?.scrollTop,
											document?.body?.scrollTop,
											document?.head?.scrollTop,
											0
										].filter( (p)=>{return p>=0} );
										
	return Math.max(...t);
}

function absBoundingClientRect(el){
	let st = [window?.scrollY,
					window?.pageYOffset,
					el?.ownerDocument?.documentElement?.scrollTop,
					document?.documentElement?.scrollTop,
					document?.body?.parentNode?.scrollTop,
					document?.body?.scrollTop,
					document?.head?.scrollTop];
					
		let sl = [window?.scrollX,
						window?.pageXOffset,
						el?.ownerDocument?.documentElement?.scrollLeft,
						document?.documentElement?.scrollLeft,
						document?.body?.parentNode?.scrollLeft,
						document?.body?.scrollLeft,
						document?.head?.scrollLeft];
						
				let scrollTop=0;
				for(let k=0; k<st.length; k++){
					if(!!st[k] && typeof  st[k] !=='undefined' && st[k]>0){
						scrollTop=(st[k]>scrollTop)?st[k]:scrollTop;
					}
				}			

				let scrollLeft=0;
				for(let k=0; k<sl.length; k++){
					if(!!sl[k] && typeof  sl[k] !=='undefined' && sl[k]>0){
						scrollLeft=(sl[k]>scrollLeft)?sl[k]:scrollLeft;
					}
				}
	
	const rct=el.getBoundingClientRect();
	let r={};

	r.left=rct.left+scrollLeft;
	r.right=rct.right+scrollLeft;
	r.top=rct.top+scrollTop;
	r.bottom=rct.bottom+scrollTop;
	r.height=rct.height;
	r.width=rct.width;
	
	return r;
}

function removeEls(d, array) {
    var newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != d) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

function getAncestors(el, elementsOnly, elToHTML, notInShadow){
	firstParent=el;
	let ancestors=[el];
	let outAncestors=[];
	let end=false;
	while(!end){
		if(!!firstParent.parentElement && typeof firstParent.parentElement!=='undefined'){
			if(firstParent.parentElement.tagName==='BODY' || firstParent.parentElement.tagName==='HEAD' || firstParent.parentElement.tagName==='HTML'){
				end=true;
			}else{
				firstParent=firstParent.parentElement;
			}
		}else if(!!firstParent.parentNode && typeof firstParent.parentNode!=='undefined'){
				firstParent=firstParent.parentNode;
		}else if(!!firstParent.host && typeof firstParent.host!=='undefined'){
				firstParent=firstParent.host;
		}else{
			end=true;
		}
		if(!end){
			if(!elementsOnly || (elementsOnly && firstParent.nodeType==1)){
				if(elToHTML){
					ancestors.push(firstParent);
				}else{
					ancestors.unshift(firstParent);
				}
			}
		}
	}
	
	if(notInShadow){
		if(elToHTML){
			for(let i=ancestors.length-1; i>=0; i--){
				outAncestors.unshift(ancestors[i]);
				if(!!ancestors[i].shadowRoot && typeof ancestors[i].shadowRoot !=='undefined'){
					i=0;
				}
			}
		}else{
			for(let i=0, len=ancestors.length; i<len; i++){
				outAncestors.push(ancestors[i]);
				if(!!ancestors[i].shadowRoot && typeof ancestors[i].shadowRoot !=='undefined'){
					i=len-1;
				}
			}
		}
	}else{
		outAncestors=ancestors;
	}
	return outAncestors;
}

function expandFrame(fr){
			fr.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
			 
			 
			fr.style.setProperty( 'margin', 0, 'important' );
			fr.style.setProperty( 'border', 0, 'important' );
			fr.style.setProperty( 'padding', 0, 'important' );
	
			fr.style.setProperty( 'max-height','-webkit-fill-available', 'important' );
			fr.style.setProperty( 'max-width','-webkit-fill-available', 'important' );
			fr.style.setProperty( 'min-height','100vh', 'important' );
			fr.style.setProperty( 'min-width','100vw', 'important' );
			fr.style.setProperty( 'height','-webkit-fill-available', 'important' );
			fr.style.setProperty( 'position','fixed', 'important' );
			fr.style.setProperty( 'width','-webkit-fill-available', 'important' );

			fr.style.setProperty( 'top',  window.screen.availTop+'px', 'important' );
			fr.style.setProperty( 'left',  window.screen.availLeft+'px', 'important' );
}


function messageHdl(request, sender, sendResponse) {
	//console.log(request);
	if(typeof request.type !=='undefined'){
		 if(request.type ==='close'){
		if(document.URL!=request.message){
			
					let xfr=null;
		for(let i=0; i<expnd.length; i++){
			if (expnd[i].src===request.message || expnd[i].getAttribute('data-src')===request.message){
				xfr=expnd[i];
				break;
			}
		}
		
		if(!xfr){
			
					let ifrs=getTagNameShadow(document,'IFRAME');
		for(let i=0; i<ifrs.length; i++){
			if (ifrs[i].src===request.message || ifrs[i].getAttribute('data-src')===request.message){
				fr=ifrs[i];
				expnd.push(fr);
				break;
			}
		}
			
			if(!!fr){
				expandFrame(fr);
			}
		}else{
			
			
		let ifrs=getTagNameShadow(document,'IFRAME');
		let fr=null;
		for(let i=0; i<ifrs.length; i++){
			if (ifrs[i].src===request.message || ifrs[i].getAttribute('data-src')===request.message){
				fr=ifrs[i];
				expnd=removeEls(fr, expnd);
				break;
			}
		}
		
		if(!!fr){
		let hg=Math.abs(request.bottom-request.top);
		let wd=Math.abs(request.right-request.left);
			fr.style.setProperty( 'max-height', hg+'px', 'important' );
			fr.style.setProperty( 'max-width', wd+'px', 'important' );	
			fr.style.setProperty( 'min-height', hg+'px', 'important' );
			fr.style.setProperty( 'min-width', wd+'px', 'important' );
			fr.style.setProperty( 'height', hg+'px', 'important' );
			fr.style.setProperty( 'width', wd+'px', 'important' );	

			fr.style.setProperty( 'top', request.top+'px', 'important' );
			fr.style.setProperty( 'left', request.left+'px', 'important' );
			
	}
	
		}
	}
	
	
	}else if(request.type ==='expand'){
		if(document.URL==request.message && init){
		handleBrowserActionClicked(request);
		init=false;
		}
	}

	}else{
	
	if(window.location.href==request.message){
	if(init){
	 handleBrowserActionClicked(request);
		init=false;
		}
	}else{
		//if(init){
			 convertEmbeds();
			//console.log(window.location.href);
			//}
	}
		// init=false;
		
}
 return true;
}

chrome.runtime.onMessage.addListener(messageHdl);

function convertEmbeds(){
	
	function emb_to_ifr(embeds){
	embeds.forEach(function(node) {
		try{
			let rgx=new RegExp('<embed ', '');
			node.outerHTML=node.outerHTML.split(rgx).join('<iframe ');
			node.outerHTML=node.outerHTML.split('</embed>').join('</iframe>');
		}catch(e){
			node.outerHTML='<iframe data-src="'+node.getAttribute('data-src')+'" src="'+node.src+'"></iframe>';
		}
	});
	//return embeds;
	}
	
	
	let embeds=getTagNameShadow(document,'EMBED');

emb_to_ifr(embeds);

}


function handleBrowserActionClicked(bgMsg) {

let ifrm=document.createElement('iframe');
ifrm.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
ifrm.style.setProperty( 'width', '-webkit-fill-available', 'important' );
ifrm.style.setProperty( 'margin', 0, 'important' );
ifrm.style.setProperty( 'border', 0, 'important' );
ifrm.style.setProperty( 'padding', 0, 'important' );
ifrm.style.setProperty( 'display', 'flex', 'important' );
ifrm.style.setProperty( 'visibility', 'visible', 'important' );
ifrm.style.setProperty( 'position', 'absolute', 'important' );
ifrm.style.setProperty( 'transform', 'translateY(0px)', 'important' );


ifrm.style.setProperty( 'top', '0.37ch', 'important' );
ifrm.style.setProperty( 'left', '0.66ch', 'important' );

let ifrm2=document.createElement('iframe');
ifrm2.style.setProperty( 'position', 'absolute', 'important' );
ifrm2.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
ifrm2.style.setProperty( 'min-width', '-webkit-fill-available', 'important' );
ifrm2.style.setProperty( 'width', '-webkit-fill-available', 'important' );
ifrm2.style.setProperty( 'margin', 0, 'important' );
ifrm2.style.setProperty( 'border', 0, 'important' );
ifrm2.style.setProperty( 'padding', 0, 'important' );
ifrm2.style.setProperty( 'min-height', '100vh', 'important' );
ifrm2.style.setProperty( 'display', 'flex', 'important' );
ifrm2.style.setProperty( 'visibility', 'visible', 'important' );
ifrm2.style.setProperty( 'background', '#121212', 'important' );
ifrm2.style.setProperty( 'transform', 'translateY(0px)', 'important' );
ifrm2.style.setProperty( 'transform-origin', 'left top', 'important' );

let ifrm3=document.createElement('iframe');
ifrm3.style.setProperty( 'position', 'absolute', 'important' );
ifrm3.style.setProperty( 'z-index', Number.MAX_SAFE_INTEGER, 'important' );
ifrm3.style.setProperty( 'min-height', '100vh', 'important' );
ifrm3.style.setProperty( 'min-width', '-webkit-fill-available', 'important' );
ifrm3.style.setProperty( 'width', '-webkit-fill-available', 'important' );
ifrm3.style.setProperty( 'margin', 0, 'important' );
ifrm3.style.setProperty( 'border', 0, 'important' );
ifrm3.style.setProperty( 'padding', 0, 'important' );
ifrm3.style.setProperty( 'display', 'flex', 'important' );
ifrm3.style.setProperty( 'visibility', 'visible', 'important' );
ifrm3.style.setProperty( 'transform', 'translateY(0px)', 'important' );
ifrm3.style.setProperty( 'transform-origin', 'left top', 'important' );

let ht_a=`
<style>
input::-webkit-textfield-decoration-container {
    background: buttonface;
}
</style>
<main style="margin: 0px !important; border: 0px !important; padding: 0px !important; background-color: black !important;">
<button style="background-color: buttonface !important; visibility: initial !important;" id="three_plus" type="button">+ 3 thumbs</button>
<button style="background-color: buttonface !important; visibility: initial !important;" id="three_neg" type="button">- 3 thumbs</button>
<button style="background-color: buttonface !important; display: none; visibility: initial !important;" type="button" id="every"></button>
<button style="background-color: buttonface !important; visibility: initial !important;" id="clear_er" type="button">Clear</button>
<select style="width: 46.6vw; color: black; background-color: buttonface; visibility: initial !important;" name="txt_Bx" id="txt_Bx"></select>

<input style="background-color: buttonface !important; visibility: initial !important;" id="scnB" type="button" Value="Scan for video">
<input style="background-color: buttonface !important; visibility: initial !important;" id="genB" type="button" Value="Select video">
<input style="background-color: buttonface !important; visibility: initial !important;" id="opnVd" type="button" Value="Open link">
`;

if(typeof bgMsg.top !=='undefined'){
	ht_a+= '<input lft="'+bgMsg.left+'" rgt="'+bgMsg.right+'" tp="'+bgMsg.top+'" btm="'+bgMsg.bottom+'" style="background-color: buttonface !important; visibility: initial !important;" id="rstD" type="button" Value="Toggle maximise">'
}

ht_a+=`
<br>
<span style="color: #dfdfdf !important;font-size: 1.83ch !important;visibility: initial !important;background-color: #f0f0f0d4 !important;" id="frames" title="Scroll here to change number of frames.">24</span>
<span style="color: #dfdfdf !important; font-size: 1.83ch !important; margin-inline-start: 4.4ch !important; visibility: initial !important;background-color: #000000b5 !important;" title="Maximum speed when speeding through; scroll to change.">Max speed: </span>
<input title="Maximum speed when speeding through; scroll to change." type="number" id="mxs" min="1" max="16" step="0.5" value="6" style="width: 9ch !important; background-color: buttonface !important; border-width: 0px !important; visibility: initial !important;"></input>
</main>
`


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

<section style="display: inline-flex !important;display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;">
<div id="thumbs">
<section style="display: inline-flex !important;"></section>
</div>
</section>
`;

let ht_d=`
<section id="bSec" style="display: inline-flex !important;position: fixed !important; width: min-content !important; top: 0px !important; left: 0px !important; flex-direction: column !important;">	
<button id="scroll_curr" style="background-color: buttonface !important;">Scroll to current thumb</button>
<button id="scroll_vid" style="background-color: buttonface !important;">Scroll to video</button>
<button id="spdt" style="background-color: buttonface !important;">Speed through video</button>
<button id="pnp" style="background-color: buttonface !important;">Toggle picture-in-picture</button>
<button id="mvvb" style="background-color: buttonface !important;">Toggle relocate video</button>

<div id="currTime" style="color: white !important;background-color: black !important;font-size: 185% !important;font-weight: bold !important;text-align: center !important;"></div>
</section>
`;

function pageScript(){
var lddArr=[];
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
var shiftBtns2=null;
var ifrmRsz=()=>{

	 let scR=absBoundingClientRect(sc1);

	let bSectR=absBoundingClientRect(bSect);
	ifrm3.style.minWidth=bSectR.width+'px';
	ifrm3.style.width=bSectR.width+'px';
	ifrm3.style.maxWidth=bSectR.width+'px';

	ifrm3.style.minHeight=bSectR.height+'px';
	ifrm3.style.height=bSectR.height+'px';
	ifrm3.style.maxHeight=bSectR.height+'px';

	let ifrm3R=absBoundingClientRect(ifrm3);
	let wd=getScreenWidth(true);
	let i2w=wd-ifrm3R.width;
	ifrm3.style.left=i2w+'px';
	
	sc1.style.minWidth=i2w+'px';
	sc1.style.width=i2w+'px';
	sc1.style.maxWidth=i2w+'px';
	
	ifrm2.style.minWidth=i2w+'px';
	ifrm2.style.width=i2w+'px';
	ifrm2.style.maxWidth=i2w+'px';
	
	let ifrm2R=absBoundingClientRect(ifrm2);
	if(!vfr){
		ifrm3.style.left=ifrm2R.right+'px';
	}
	
	let td=(typeof thumbs!=='undefined')?true:false;
	
	if(td){
				thumbs.style.minWidth=i2w+'px';
				thumbs.style.width=i2w+'px';
				thumbs.style.maxWidth=i2w+'px';
				let scts=[...thumbs.children];

			for(let j = 0; j < scts.length; j++){
				
				let figs=[...scts[j].children];

				sctPrp=(figs.length==0)?i2w:i2w/figs.length;
				sctPrp_f=sctPrp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});

				let sctW=0;
				for (let i = 0; i < figs.length; i++) {
					sctW+=figs[i].scrollWidth;
				}
				fPrp=(sctW==0)?1:(i2w/(sctW/figs.length))*(1/3);
				fPrp_f=fPrp.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});
				scts[j].style.zoom=fPrp_f;
			}
	}
		
	if(shiftBtns2!==null){
		shiftBtns2();
	}
	
	
	let sc1R=absBoundingClientRect(sc1);
	ifrm2R=absBoundingClientRect(sc1);
	let h=getScreenHeight(true);
	h=h-ifrm2R.top;
	h=(h<0 ||  h<sc1R.height)?sc1R.height:h;
	
	ifrm2.style.minHeight=h+'px';
	ifrm2.style.height=h+'px';
	ifrm2.style.maxHeight=h+'px';

}

var rsz_ifrm=()=>{
	let mainRct=absBoundingClientRect(main); 
	if(!!firstAncestor){
		firstAncestor.style.setProperty( 'transform-origin','left bottom','important' );
		firstAncestor.style.setProperty( 'transform', 'scale(0.97) translateY('+mainRct.height+'px)','important' );
		
		
		let fprc=absBoundingClientRect(firstParent);
		let vrc=absBoundingClientRect(myVdo);
		
		let tp=Math.max(fprc.bottom,vrc.bottom)+gapVid;
		ifrm2.style.top=tp+'px';
		ifrm3.style.top=tp+'px';
		ifrm2.style.left='0.22%';
	}
	
	ifrm.style.setProperty( 'height', (mainRct.height)+'px', 'important' );
}

ifrm.contentWindow.document.body.style.setProperty( 'margin', 0, 'important' );
ifrm.contentWindow.document.body.style.setProperty( 'border', 0, 'important' );
ifrm.contentWindow.document.body.style.setProperty( 'padding', 0, 'important' );
ifrm.contentWindow.document.body.style.setProperty( 'display', 'inline-flex', 'important' );
ifrm.contentWindow.document.documentElement.style.setProperty( 'display', 'inline-table', 'important' );

ifrm2.contentWindow.document.body.style.setProperty( 'margin', 0, 'important' );
ifrm2.contentWindow.document.body.style.setProperty( 'border', 0, 'important' );
ifrm2.contentWindow.document.body.style.setProperty( 'padding', 0, 'important' );
ifrm2.contentWindow.document.body.style.setProperty( 'overflow', 'hidden', 'important' );

ifrm3.contentWindow.document.body.style.setProperty( 'margin', 0, 'important' );
ifrm3.contentWindow.document.body.style.setProperty( 'border', 0, 'important' );
ifrm3.contentWindow.document.body.style.setProperty( 'padding', 0, 'important' );

var main=[...ifrm.contentWindow.document.getElementsByTagName("main")][0];
let mainRct=absBoundingClientRect(main);

ifrm.style.setProperty( 'min-height', (mainRct.height)+'px', 'important' );
ifrm.style.setProperty( 'height', (mainRct.height)+'px', 'important' );

let scrBr=`
<style>
video::-webkit-media-controls {
    display: flex !important;
    visibility: visible !important;
}
body > *, head > *{
	transform: translateY(`+mainRct.bottom+`px) !important;
	
}
</style>
`
document.head.insertAdjacentHTML('afterbegin',scrBr);

var maxBtm=0;

let allNodes=[...document.querySelectorAll('*')];

	allNodes.forEach(function(node) {
		let rct= absBoundingClientRect(node);
		maxBtm=(rct.bottom>maxBtm)?rct.bottom:maxBtm;
	});


ifrm2.style.setProperty( 'top', maxBtm+'px', 'important' );
ifrm3.style.setProperty( 'top', maxBtm+'px', 'important' );
ifrm.scrollIntoView();

var sc1=[...ifrm2.contentWindow.document.getElementsByTagName("section")][0];
sc1.style.setProperty( 'min-width', '100%', 'important' );
sc1.style.setProperty( 'width', '100%', 'important' );
var frame_btn=[...ifrm.contentWindow.document.querySelectorAll("span#frames")][0];
var three_Plus=[...ifrm.contentWindow.document.querySelectorAll("button#three_plus")][0];
var three_Neg=[...ifrm.contentWindow.document.querySelectorAll("button#three_neg")][0];
var clrr=[...ifrm.contentWindow.document.querySelectorAll("button#clear_er")][0];
var mxsp=[...ifrm.contentWindow.document.querySelectorAll("input#mxs")][0];

var myVdo;
var wndWh=false;
var shb2=false;
var figSk=false;
var myVdo_el=[];

var bSect=[...ifrm3.contentWindow.document.querySelectorAll("section#bSec")][0];
var mvdb=[...ifrm3.contentWindow.document.querySelectorAll("button#mvvb")][0];

ifrmRsz();

/*let sc1w=(absBoundingClientRect(bSect).left-mgLft).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});

 sc1.style.minWidth=sc1w+'px';
 sc1.style.width=sc1w+'px';
 sc1.style.maxWidth=sc1w+'px';*/

var thumbs=[...ifrm2.contentWindow.document.querySelectorAll("div#thumbs")][0];
thumbs.style.setProperty('transform-origin','top left', 'important' );
var threeSct=thumbs.firstChild;
thumbs.style.setProperty( 'margin', 0, 'important' );
thumbs.style.setProperty( 'border', 0, 'important' );
thumbs.style.setProperty( 'padding', 0, 'important' );

var scrl= [...ifrm3.contentWindow.document.querySelectorAll("button#scroll_curr")][0];
var scrv= [...ifrm3.contentWindow.document.querySelectorAll("button#scroll_vid")][0];
var spb= [...ifrm3.contentWindow.document.querySelectorAll("button#spdt")][0];
var pip= [...ifrm3.contentWindow.document.querySelectorAll("button#pnp")][0];
var curr  =[...ifrm3.contentWindow.document.querySelectorAll("div#currTime")][0];

var evry= [...ifrm.contentWindow.document.querySelectorAll("button#every")][0];
var scanB= [...ifrm.contentWindow.document.querySelectorAll("input#scnB")][0];
var gnrB= [...ifrm.contentWindow.document.querySelectorAll("input#genB")][0];

var opnr= [...ifrm.contentWindow.document.querySelectorAll("input#opnVd")][0];
var clse;

try{
	clse=[...ifrm.contentWindow.document.querySelectorAll("input#rstD")][0];
	clse.onclick=()=>{
					exBool=(exBool)?false:true;
					chrome.runtime.sendMessage({msg: clse.ownerDocument.URL, left: parseFloat(clse.attributes.lft.value), right: parseFloat(clse.attributes.rgt.value), top: parseFloat(clse.attributes.tp.value), bottom: parseFloat(clse.attributes.btm.value), type:'close', boolMrk:exBool}, function(response){
					});
	}
}catch(e){;}

var sp_swtch=0;

var txtBx = [...ifrm.contentWindow.document.querySelectorAll('select#txt_Bx')][0];
//var pgrCSS = [...ifrm2.contentWindow.document.querySelectorAll('style#pgrB')][0];
var vids=[];
var vhw={w:0,h:0};
var allFrames=[];

var ancsRsz= ()=>{
	
	g_ancestors=getAncestors(myVdo,true,true,true);
	firstParent=g_ancestors[((g_ancestors.length==1)?0:1)];
	firstAncestor=g_ancestors[g_ancestors.length-1];
	vfr=false;
	let ifrc=absBoundingClientRect(main);
			
	if(!firstParent.ownerDocument.documentElement.contains(ifrm)){
		
		firstParent=document.documentElement;
		let mxBtm2=maxBtm;
		for(let i=0; i<allFrames.length; i++){
			if(myVdo_el[1].includes(allFrames[i][2]) && myVdo_el[1]!='' && document.documentElement.contains(allFrames[i][0])){
				let frRc=absBoundingClientRect(allFrames[i][0].contentWindow.document.documentElement);
					if(frRc.bottom>mxBtm2){
						firstParent=allFrames[i][0].contentWindow.document.documentElement;
						mxBtm2=frRc.bottom;
					}
			}
		}
		
	}
		firstAncestor.style.setProperty( 'transform-origin','left bottom','important'  );
		firstAncestor.style.setProperty( 'transform', 'scale(0.97) translateY('+ifrc.height+'px)','important'  );
	
		let fprc=absBoundingClientRect(firstParent);
		let vrc=absBoundingClientRect(myVdo);
		
		let tp=Math.max(fprc.bottom,vrc.bottom)+gapVid;
		ifrm2.style.top=tp+'px';
		ifrm3.style.top=tp+'px';
		ifrm2.style.left='0.22%';
		ifrmRsz();
}

function scrollHdl(){
	let scrollTop=getScrollY();
	let ifrm2R=absBoundingClientRect(ifrm2);
	scrollTop=( (scrollTop>ifrm2R.top)? scrollTop : ifrm2R.top );
	ifrm3.style.top=scrollTop+'px';
}
			
var shiftVid=(force_default_place)=>{
		if(force_default_place){ //put video back in original location
			if(firstAncestor.getAttribute('css_txt')!==null){
				firstAncestor.style.cssText=firstAncestor.getAttribute('css_txt');
			}

			let p=ifrm2.style.cssText.split(/transform\s*\:\s*[^\!]*/);
						 ifrm2.style.cssText=p.join('transform: translateY(0px) ');
		}else{
							if(firstAncestor.getAttribute('css_txt')===null){
								firstAncestor.setAttribute('css_txt',firstAncestor.style.cssText);
							}
							
							let p=ifrm2.style.cssText.split(/transform\s*\:\s*[^\!]*/);
							ifrm2.style.cssText=p.join('transform: scale(calc(2/3)) ');
							scrollHdl();
							let ifrm2R=absBoundingClientRect(ifrm2);
							let ifrm3R=absBoundingClientRect(ifrm3);
							//let wdt=getScreenWidth();

							let vw=ifrm3R.left-ifrm2R.right;
							let s=vw/myVdo.clientWidth;
							
							firstAncestor.style.cssText='';
							firstAncestor.style.setProperty('position','fixed', 'important' );	
							firstAncestor.style.setProperty('top','0px', 'important' );	
							firstAncestor.style.setProperty('left','0px', 'important' );	
							firstAncestor.style.setProperty('transform-origin','top left', 'important' );	
							firstAncestor.style.setProperty('transform','scale('+s+')','important' );
							let myVdoR=absBoundingClientRect(myVdo);
							firstAncestor.style.setProperty('transform','scale('+s+') translateX('+((ifrm2R.right-myVdoR.left)/s)+'px) translateY('+((ifrm3R.top-myVdoR.top)/s)+'px)', 'important' );
		}
}

var rsz= ()=>{
	ifrmRsz();
}

clrr.onclick=()=>{
	rsz_ifrm();
	clr();
}

evry.onclick=()=>{
	rsz_ifrm();
	setEveryFrames();
}

three_Plus.onclick=()=>{
	rsz_ifrm();
	setPlusFrames();
}

three_Neg.onclick=()=>{
	rsz_ifrm();
	setMinusFrames();
}

scanB.onclick=()=>{
	rsz_ifrm();
	ifrScan();
}

gnrB.onclick=()=>{
	rsz_ifrm();
	changeValue();
}

opnr.onclick=()=>{
	rsz_ifrm();
	LnkOp();
}

main.onwheel=(event)=>{
	event.preventDefault();
	event.stopPropagation();
	rsz_ifrm();
}

txtBx.onchange=()=>{
	 gnrB.value='Select video';
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
			let rct=absBoundingClientRect(ths);
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
	ifrmRsz();
	}
}


function shiftBtns(bool){
	try{
	//curr.style.top=(parseFloat(pip.style.top)+4)+'px';
	if(bool){
	let r=absBoundingClientRect(mvdb);
	pip.style.top=(r.top-r.height-2)+'px';
	r=absBoundingClientRect(pip);
	spb.style.top=(r.top-r.height-2)+'px';
	r=absBoundingClientRect(spb);
	scrv.style.top=(r.top-r.height-2)+'px';
	r=absBoundingClientRect(scrv);
	scrl.style.top=(r.top-r.height-2)+'px';
	}
	}catch(e){;}
}

//shiftBtns(true);



function calcSp(){
if(sp_swtch==1 && aseek==0 && mxsp.valueAsNumber>1){ 
				var lddRaw;
				var rgs=[];
				var lastPart=false;
				let c_i=myVdo.currentTime;
			for (let k=myVdo.buffered.length-1; k>=0; k--){
			let t_i=myVdo.buffered.end(k);
			let s_i=myVdo.buffered.start(k);
			
				if(t_i==myVdo.duration && c_i>=s_i){
					lastPart=true;
					break;
				}else if(c_i>=s_i && t_i>=c_i){
					rgs.push([s_i,t_i]);
				}
			}
			let vN=(Number.isNaN(mxsp.valueAsNumber))?1:mxsp.valueAsNumber;
			
			if(lastPart){
						myVdo.playbackRate=vN;		
			}else{
					var tot=0;
					if(rgs.length>0){
						
					let sorted=rgs.sort((a, b) => {return a[0] - b[0];})
					tot=sorted[0][1]-c_i;
					
					for (let k=1; k<sorted.length; k++){
						if(sorted[k-1][1]==sorted[k][0]){
							tot+=sorted[k][1]-sorted[k][0];
						}else{
							break;
						}
					}
					
					}
		

						lddRaw=(myVdo.playbackRate==0)?tot:tot/myVdo.playbackRate;
						if( (!myVdo.paused) ||  (myVdo.paused && lddRaw<2) ){
						let prev_mx=(lddArr.length==0)?lddRaw:Math.max(...lddArr);
						lddArr.push(lddRaw);
						let outSp=vN;
						if(lddRaw!=2){
							//50*tot=(1/2)*100*tot ; for >= 2 real secs loaded
								if(lddRaw<2){
								 outSp=Math.min(vN,Math.max(Math.floor(50*tot)*0.01,1));
								}else if(lddRaw>prev_mx){
									lddArr=[];
								}else{
										//let mx=Math.max(...lddArr);
										let mn=Math.min(...lddArr);
										let rng=prev_mx-mn;
										let rng_norm=(prev_mx==0)?1:Math.sqrt(rng/prev_mx);
										let outSp=Math.min(Math.floor(100*((1-rng_norm)*vN+rng_norm))*0.01,Math.min(vN,Math.max(Math.floor(50*tot)*0.01,1)));
							}
						}
						//if(outSp!=myVdo.playbackRate){
							myVdo.playbackRate=outSp;
						//}
}
			}
				
					}

}

function adjRate(){
if(sp_swtch==1){
myVdo.playbackRate=Math.min(16,Math.max(1,mxsp.valueAsNumber));
lddArr=[];
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
	setScrollY(absBoundingClientRect(myVdo).top,false);
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
lddArr=[];
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

rsz_ifrm();

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

txtBx.innerHTML="";
gnrB.value='Select video';

	function getContainedFrames(f){
		try{
			return f[0].contentWindow.window.frames;
		}catch(e){;}
	}
		
		vids=[];
		allFrames=[];
		let gene=0;


		let vids0=getTagNameShadow(document,'VIDEO');
		for (let k=0; k<vids0.length; k++){
			vids.push([vids0[k],'']);
		}


	let frms=getTagNameShadow(document,'IFRAME'); 
	
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
		let frms1=getContainedFrames(allFrames[j]); 
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
		
		try{
					vids1=getTagNameShadow(allFrames[j][0].document,'VIDEO');
		}catch(e){
			try{
				vids1=getTagNameShadow(allFrames[j][0].contentDocument,'VIDEO');
			}catch(e){;}
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
		
		vids=[...filt_vid];		
				
		 allFrames.forEach((frame,index) => {
			 let vwg=false;
			 for(let i=0; i<vids.length; i++){
				 if(vids[i][1].includes(frame[2]) && vids[i][1]!=''){
					 vwg=true;
					 i=vids.length-1;
				 }
			 }
			 
			 try{
				 
				 if(!vwg && !!frame[0].src && frame[0].src!='' && frame[0].src!='about:blank' && frame[0].src!='javascript:false'&& frame[0].src!='javascript:true' && frame[0]!==ifrm && frame[0]!=ifrm2){
					 	frame[0].style.setProperty( 'visibility', 'visible', 'important' );
						let opt = document.createElement('option');
						opt.textContent=frame[0].src;
						opt.setAttribute("index", '-'+index);
						opt.setAttribute("link", frame[0].src);
						opt.style.cssText='color: black !important;';
						txtBx.appendChild(opt);	
			tbG=false;
		   gnrB.value='Select video';
				 }
				}catch(e){;}			

				try{
				 if(!vwg && !!frame[0].getAttribute('data-src') && frame[0].getAttribute('data-src')!='' && frame[0].getAttribute('data-src')!='about:blank' && frame[0].getAttribute('data-src')!='javascript:false'&& frame[0].getAttribute('data-src')!='javascript:true' && frame[0]!==ifrm && frame[0]!=ifrm2){
					 	frame[0].style.setProperty( 'visibility', 'visible', 'important' );
						let opt = document.createElement('option');
						opt.textContent=frame[0].getAttribute('data-src');
						opt.setAttribute("index", '-'+index);
						opt.setAttribute("link", frame[0].getAttribute('data-src'));
						opt.style.cssText='color: black !important;';
						txtBx.appendChild(opt);	
			tbG=false;
		   gnrB.value='Select video';
				 }
				}catch(e){;}

			});
			

	let pxs=0;
	let drt=0;
	  vids.forEach((vid,index) => {
    let opt = document.createElement('option');
	opt.setAttribute("index", index);
	let lk=vidSrc(vid[0]);
	opt.setAttribute("link", lk);
	opt.style.cssText='color: black !important;';
    opt.textContent = '('+formatTime(vid[0].duration)+') - '+lk;
	    txtBx.appendChild(opt);	
		tbG=false;
		   gnrB.value='Select video';
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
  });
  
}

function LnkOp()
{
	
		if(txtBx.children.length>0){
		let selIx=txtBx[txtBx.selectedIndex].getAttribute('index');
		let tIx=parseInt(selIx);
		let tIx_el=Math.abs(selIx);
			let frEl=allFrames[tIx_el][0];
			chrome.runtime.sendMessage({msg: txtBx[txtBx.selectedIndex].attributes.link.value, type: 'open'}, function(response){});
			
			}
	
}
	function changeValue()
{
	if(txtBx.children.length>0){
		let selIx=txtBx[txtBx.selectedIndex].getAttribute('index');
		let tIx=parseInt(selIx);
		let tIx_el=Math.abs(selIx);
			let frEl=allFrames[tIx_el][0];
		if(tIx<0){
			if(!expnd.includes(frEl)){
			let frct=absBoundingClientRect(frEl);
			chrome.runtime.sendMessage({msg: txtBx[txtBx.selectedIndex].attributes.link.value, left: frct.left, right: frct.right, top: frct.top, bottom: frct.bottom, type: 'expand'}, function(response){
			 gnrB.value='iFrame expanded!';

			 expandFrame(frEl);
				
			/*frEl.scrolling="yes";
			frEl.allowfullscreen="true"; 
			frEl.webkitallowfullscreen="true"; 
			frEl.mozallowfullscreen="true";*/
			
			expnd.push(frEl);
			});
		}
		}else if(!tbG){
		curr_thumb=0;
		loadFlag=false;
		ttmp=0;
		ev_t=-1;
		/*let txtVal=txtBx.value;
		alert(txtVal);  
		vid.src = txtVal;      
		myVdo.load(); 
		myVdo.pause();*/
		myVdo_el=vids[tIx_el];
		myVdo=myVdo_el[0];
		
		ancsRsz();
			
		shiftBtns(true);

		thumbs.style.setProperty( 'visibility', 'visible', 'important' );
		vrc= absBoundingClientRect(myVdo);

		ifrm.scrollIntoView();
		

myVdo.addEventListener("progress", (event) => {
if(myVdo.readyState>2){
calcSp();
}else{
myVdo.playbackRate=1;
}
});

myVdo.addEventListener("play", (event) => {
if(myVdo.readyState>2){
calcSp();
}else{
myVdo.playbackRate=1;
}
});

myVdo.addEventListener("seeked", (event) => {
t_a=myVdo.currentTime;
if(myVdo.readyState>2){
calcSp();
}else{
myVdo.playbackRate=1;
}
});
		
myVdo.addEventListener("timeupdate", (event) => {
	if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	ifrmRsz();
	}
});		

myVdo.addEventListener("durationchange", (event) => {
	//un_hider(true);
  checkDur();
});

myVdo.addEventListener("loadedmetadata", (event) => {
  checkDur();
});		

myVdo.addEventListener("ratechange", (event) => {
	if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	ifrmRsz();
	}
	if(myVdo.readyState>2){
	calcSp();
	}
});		

		 allFrames.forEach((frame,index) => {
			if(!myVdo_el[1].includes(frame[2]) && myVdo_el[1]!='' && frame[0]!==ifrm && frame[0]!==ifrm2){
			frame[0].style.setProperty( 'display', 'none', 'important' );
			}/*else{
				//node.style.setProperty( 'pointer-events', '', 'important' );
			}*/
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
		scrl.style.display='none';
		shiftBtns(true);
		mvdb.style.display='none';
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
ifrmRsz();
}

var tu2=(event) => {
		if(!tTrkFlg){
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	ifrmRsz();
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
		
if(myVdo.readyState>0){
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
			pgBar(nowFlag,progresses[nowFlag],e,attr,myVdo.duration);
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
}

myVdo.addEventListener("timeupdate", (event)=>{
	tu2(event);
});	

myVdo.addEventListener("playing", (event)=>{
	tu2(event);
});		


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
			gnrB.value='Generating thumbs';
			generateThumbnail();
			ttmp++;
			if (ttmp<done_t) {
			t_b=performance.now();
			let tm=t_b-t_a;
			mx=(tm>mx)?tm:mx;
			tTrkFlg=true;
			curr.innerText= formatTime(myVdo.currentTime)+"\n"+ttmp+"/"+done_t;
			ifrmRsz();
			if(ttmp===1){
				ifrm2.scrollIntoView();
			}
			myVdo.currentTime = ttmp*(myVdo.duration/t);
			}else {
				endGtMv();
				aseek=0;
				gnrB.value='Generate thumbs';
				tTrkFlg=false;
				time_track=-1;
				ttmp=0;
				myVdo.currentTime=0;
				mvdb.style.display='block';
				shiftBtns(false);
				scrl.style.display='';
				rsz();
				ifrm2.scrollIntoView();

				shiftBtns2=(handleScr)=>{
						if(!shb2){
								shb2=true;
								if(typeof handleScr==='undefined' || handleScr===true){
									scrollHdl();
								}
								if(vfr){
									shiftVid(false);
								}else{
									shiftVid(true);
								}

						shb2=false;
					}
				};
				
				mvdb.onclick=function(){
					vfr=!vfr;
					shb2=false;
					shiftBtns2(false);
				};
									
					function wnd_wheel(event){
							if(!wndWh){
								wndWh=true;
								if(event.composedPath().includes(myVdo)){
									skip(event);
								}
								wndWh=false;
							}
					}
							
					ifrm2.ownerDocument.addEventListener("wheel", (event) => {
						wnd_wheel(event);
						shiftBtns2();
					}, {capture: true, passive:false});
					ifrm2.ownerDocument.addEventListener("wheel", (event) => {
						wnd_wheel(event);
						shiftBtns2();
					}, {capture: false, passive:false});

					ifrm2.ownerDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: true, passive:false});
					ifrm2.ownerDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: false, passive:false});

					ifrm3.ownerDocument.addEventListener("wheel", (event) => {
						wnd_wheel(event);
						shiftBtns2();
					}, {capture: true, passive:false});
					ifrm3.ownerDocument.addEventListener("wheel", (event) => {
						wnd_wheel(event);
						shiftBtns2();
					}, {capture: false, passive:false});

					ifrm3.ownerDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: true, passive:false});
					ifrm3.ownerDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: false, passive:false});
					
		function figSkipper(event){
			try{
						if(!figSk){
							figSk=true;							
							//if(event.composedPath().filter((p)=>{return p.tagName==='FIGURE';}).length>0){
								skip(event);						
								let t=captions[curr_thumb].parentElement.parentElement;
								t.scrollIntoView();
							//}
							figSk=false;
						}
			}catch(e){figSk=false;}
		}
					
		function if2w(event){
						event.preventDefault();
						event.stopPropagation();
						figSkipper(event);
		}
					ifrm2.contentDocument.addEventListener("wheel", (event) => {
						if2w(event);
					}, {capture: false, passive:false});
					
					ifrm2.contentDocument.addEventListener("wheel", (event) => {
						if2w(event);
					}, {capture: true, passive:false});
					
					ifrm2.contentDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: false, passive:false});		
					ifrm2.contentDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: true, passive:false});	

					ifrm3.contentDocument.addEventListener("wheel", (event) => {
						shiftBtns2();
					}, {capture: false, passive:false});
					ifrm3.contentDocument.addEventListener("wheel", (event) => {
						shiftBtns2();
					}, {capture: true, passive:false});
					
					ifrm3.contentDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: false, passive:false});		
					ifrm3.contentDocument.addEventListener("scroll", (event) => {
						shiftBtns2();
					}, {capture: true, passive:false});				

				
			}
		}
		 
	}else{
		nowFlag=-1;
	}


}
 
 myVdo.addEventListener("error", (event) => {
	nowFlag=0;
	cap=0;
});  

myVdo.addEventListener("seeking", (event) => {
	if((aseek==1)&&(myVdo.readyState>=2)&&(myVdo.currentTime>time_track)){  
		thumbseek(true);
	}else{
		thumbseek(false);
	}
}); 

myVdo.addEventListener("wating", (event) => {
myVdo.playbackRate=1;
	if((aseek==1)&&(myVdo.readyState>=2)&&(myVdo.currentTime>time_track)){  
		thumbseek(true);
	}else{
		thumbseek(false);
	}
});

myVdo.addEventListener("seeked", (event) => {
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
});

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

let ifw=getScreenWidth(true);
ifrm2.style.setProperty=('min-width',ifw+'px','important');
ifrm2.style.setProperty=('width',ifw+'px','important');
ifrm2.style.setProperty=('max-width',ifw+'px','important');

try{
	let fprc=absBoundingClientRect(firstParent);
	let vrc=absBoundingClientRect(myVdo);
	let btm=Math.max(fprc.bottom,vrc.bottom);
	if(parseFloat(ifrm2.style.top)<parseFloat(btm+gapVid)){
		let tp=btm+gapVid;
		ifrm2.style.setProperty( 'top', tp+'px', 'important' );
		ifrm3.style.setProperty( 'top', tp+'px', 'important' );
	}
}catch(e){
							
ancsRsz();
								
}


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

pgb.style.width=window.getComputedStyle(f).width;

rsz();

ct.style.setProperty( 'transform', 'scale('+((f.scrollWidth/ct.clientWidth)*0.2).toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+')', 'important' );

  f.onclick= function(){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	  if(window.getComputedStyle(progresses[index]).display==='none'){
	nowFlag=index;
	cap=index;
	myVdo.currentTime =c.attributes.timestamp.nodeValue;
if(!myVdo.ownerDocument.pictureInPictureElement && !vfr){
			setScrollY(absBoundingClientRect(myVdo).top,false);
}else{
	this.scrollIntoView();
}
	  }
} 

 f.ondblclick=  function(e){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	  if(window.getComputedStyle(progresses[index]).display!=='none'){
	nowFlag=index;
	cap=index;
	myVdo.currentTime =c.attributes.timestamp.nodeValue;
if(!myVdo.ownerDocument.pictureInPictureElement && vfr){
			setScrollY(absBoundingClientRect(myVdo).top,false);
}else{
	this.scrollIntoView();
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

document.documentElement.style.setProperty('overflow','scroll','important');
document.body.style.setProperty('overflow','scroll','important');

document.body.insertAdjacentElement('afterbegin',ifrm);

ifrm.src = "about:blank";

ifrm.contentWindow.document.open();
ifrm.contentWindow.document.write(ht_a);
ifrm.contentWindow.document.close();

document.body.insertAdjacentElement('beforeend',ifrm2);

ifrm2.src = "about:blank";

ifrm2.contentWindow.document.open();
ifrm2.contentWindow.document.write(ht_c);
ifrm2.contentWindow.document.close();

ifrm2.insertAdjacentElement('afterend',ifrm3);

ifrm3.src = "about:blank";

ifrm3.contentWindow.document.open();
ifrm3.contentWindow.document.write(ht_d);
ifrm3.contentWindow.document.close();

pageScript();

}


} catch (e) {	
  console.error(e);
}