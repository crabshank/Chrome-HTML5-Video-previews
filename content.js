try {
	//console.log(window.location.href+" - 'HTML5 Video previews page' has access");
	var hed=document.getElementsByTagName("head")[0];	

	var fr_id=null;
	async function get_ids(){
		return new Promise(function(resolve, reject) {
			restore_options();
			chrome.runtime.sendMessage({message: "get_info", chg:window.location.href}, function(response) {
				fr_id=response.info.frameId;
				resolve();
			});
		});
	}
	(async ()=>{ await get_ids(); })();
	var plRate_var= 6;
	var everyX_var= 30;
	var relocScale_var="0.65";
	var pointerScrub_var=0.023;
	var isEnterScrub=0;
	var oneCol_var=false;
	var last_psTime=[null,false,null];
	var psDiv=null;
	var relocVid_var= false;
	var spdDef_var= false;
	var currFigCaps=[];
	var allFrames=[];
	var scrubEnt=false;
	var ifrm,ifrm2,ifrm3;
	
	function setStyle(el,prop,val,pat){
		pat=(typeof(pat)==='undefined')?new RegExp(`(?<=(^\\s*|;\\s*))${prop}\\s*\:\\s*[^;]*;?`):new RegExp(pat);
		let c=el.style.cssText;
		let cs=[...c];
		let p=c.match(pat);
		let nv=`${prop}: ${val} !important;`;
		if(p===null){
			let sc=(c.trim().endsWith(';'))?'':';';
			el.style.cssText+=sc+nv;
		}else if(p[0]!==nv){
			for(let i=p.index; i<p.index+p[0].length-1; ++i){
				cs[i]='';
			}
			cs[p.index]=nv;
			el.style.cssText=cs.join('');
		}
	}
	
	function restore_options(){
	if(typeof chrome.storage==='undefined'){
		restore_options();
	}else{
	chrome.storage.sync.get(null, function(items)
	{
		if (Object.keys(items).length != 0)
		{
			//console.log(items);
			if(typeof(items.plRate_sett)!=='undefined'){
				plRate_var=parseFloat(items.plRate_sett);
			}		
			if(typeof(items.everyX_sett)!=='undefined'){
				everyX_var=parseFloat(items.everyX_sett);
			}
			
			if(typeof(items.relocScale_sett)!=='undefined'){
				relocScale_var=items.relocScale_sett;
			}
			
			if(typeof(items.pointerScrub_sett)!=='undefined'){
				let v=items.pointerScrub_sett;
				if(v!=="0"){
					let fv=parseFloat(v);
					pointerScrub_var=(fv===0)?0:parseFloat(v);
				}else{
					pointerScrub_var=0;
				}
			}
			
			if(typeof(items.oneCol_sett)!=='undefined'){
				oneCol_var=items.oneCol_sett;
			}
			
			if(typeof(items.relocVid_sett)!=='undefined'){
				relocVid_var=items.relocVid_sett;
			}

			if(typeof(items.spdDef_sett)!=='undefined'){
				spdDef_var=items.spdDef_sett;
			}
		}
		else
		{
			save_options();
		}
	});
	}
}

function save_options(){
	
		chrome.storage.sync.clear(function() {
	chrome.storage.sync.set(
	{
		plRate_sett: "6",
		everyX_sett: "30",
		relocScale_sett: "0.65",
		oneCol_sett: false,
		relocVid_sett: false,
		pipDef_sett: false,
		spdDef_sett: false,
		pointerScrub_sett: "100%"
	}, function()
	{
		console.log('Default options saved.');
		restore_options();
	});
		});
}
	restore_options();
	
	let expnd=[];
	let expndCSS=[];
	let exBool=true;
let currentFig=null;
let init=null;
var g_ancestors=[];
var firstAncestor=null;
var firstAncestorIFR=null;
var firstAncestor_zIndex=null;
var firstAncestor_wh={};
var firstParent=null;
var vfr=false;
var tHidden=false;
var tHidden_vfr=false;
var isOneCol=false;
var jBack=false;
var doc_minHeight=null;
var suppressTU=false;
//var postRsz=false;
//let lastFigIx;
let vidSeek=true;
let justSeek=false;

function getFloat(z){
	let fz=parseFloat(z);
	fz=(isNaN(fz))?1:fz;
	return fz;
}

function setFA_wh(wcs,setWH){
	setStyle(firstAncestor,'width',wcs['width']);
	setStyle(firstAncestor,'min-width',wcs['min-width']);
	setStyle(firstAncestor,'max-width',wcs['max-width']);
	setStyle(firstAncestor,'height',wcs['height']);
	setStyle(firstAncestor,'min-height',wcs['min-height']);
	setStyle(firstAncestor,'max-height',wcs['max-height']);
	if(setWH===true){
		firstAncestor_wh['width']=wcs['width'];
		firstAncestor_wh['min-width']=wcs['min-width'];
		firstAncestor_wh['max-width']=wcs['max-width'];
		firstAncestor_wh['height']=wcs['height'];
		firstAncestor_wh['min-height']=wcs['min-height'];
		firstAncestor_wh['max-height']=wcs['max-height'];
	}
}

function elRemover(el){
	if(typeof el!=='undefined' && !!el){
	if(typeof el.parentNode!=='undefined' && !!el.parentNode){
		el.parentNode.removeChild(el);
	}
	}
}

function keepMatchesShadow(els,slcArr,isNodeName){
   if(slcArr[0]===false){
      return els;
   }else{
		let out=[];
		for(let i=0, len=els.length; i<len; i++){
		  let n=els[i];
				for(let k=0, len_k=slcArr.length; k<len_k; k++){
					let sk=slcArr[k];
					if(isNodeName){
						if((n.nodeName.toLocaleLowerCase())===sk){
							out.push(n);
						}
					}else{ //selector
						   if(!!n.matches && typeof n.matches!=='undefined' && n.matches(sk)){
							  out.push(n);
						   }
					}
				}
		}
		return out;
   	}
}

function getMatchingNodesShadow(docm, slc, isNodeName, onlyShadowRoots){
	let slcArr=[];
	if(typeof(slc)==='string'){
		slc=(isNodeName && slc!==false)?(slc.toLocaleLowerCase()):slc;
		slcArr=[slc];
	}else if(typeof(slc[0])!=='undefined'){
		for(let i=0, len=slc.length; i<len; i++){
			let s=slc[i];
			slcArr.push((isNodeName && slc!==false)?(s.toLocaleLowerCase()):s)
		}
	}else{
		slcArr=[slc];
	}
	var shrc=[docm];
	var shrc_l=1;
	var out=[];
	let srCnt=0;

	while(srCnt<shrc_l){
		let curr=shrc[srCnt];
		let sh=(!!curr.shadowRoot && typeof curr.shadowRoot !=='undefined')?true:false;
		let nk=keepMatchesShadow([curr],slcArr,isNodeName);
		let nk_l=nk.length;
		
		if( !onlyShadowRoots && nk_l>0){
			for(let i=0; i<nk_l; i++){
				out.push(nk[i]);
			}
		}
		
		for(let i=0, len=curr.childNodes.length; i<len; i++){
			shrc.push(curr.childNodes[i]);
		}
		
		if(sh){
			   let cs=curr.shadowRoot;
			   let csc=[...cs.childNodes];
			   if(onlyShadowRoots){
				  if(nk_l>0){
				   out.push({root:nk[0], childNodes:csc});
				  }
			   }
				for(let i=0, len=csc.length; i<len; i++){
					shrc.push(csc[i]);
				}
		}

		srCnt++;
		shrc_l=shrc.length;
	}
	
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
					document?.documentElement?.clientWidth,
					document?.body?.parentNode?.clientWidth,
					document?.body?.clientWidth,
					document?.head?.clientWidth
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
				
				h=h.filter( (g)=>{return g>0} );
				
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

/*function setScrollY(y,dlt){	
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

}	*/

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

function getScrollX(){					
	let t = [		window?.pageXOffset,
											window?.scrollX,
											document?.documentElement?.scrollLeft,
											document?.body?.parentNode?.scrollLeft,
											document?.body?.scrollLeft,
											document?.head?.scrollLeft,
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

function getParent(el,elementsOnly,doc_head_body){
	if(!!el && typeof el!=='undefined'){
		let out=null;
		let curr=el;
		let end=false;
		
		while(!end){
			if(!!curr.parentNode && typeof curr.parentNode!=='undefined'){
				out=curr.parentNode;
				curr=out;
				end=(elementsOnly && out.nodeType!=1)?false:true;
			}else if(!!curr.parentElement && typeof curr.parentElement!=='undefined'){
					out=curr.parentElement;
					end=true;
					curr=out;
			}else if(!!curr.host && typeof curr.host!=='undefined'){
					out=curr.host;
					end=(elementsOnly && out.nodeType!=1)?false:true;
					curr=out;
			}else{
				out=null;
				end=true;
			}
		}
		
		if(out!==null){
			if(!doc_head_body){
				if(out.nodeName==='BODY' || out.nodeName==='HEAD' || out.nodeName==='HTML'){
					out=null;
				}
			}
		}
		
		return out;
	}else{
		return null;
	}
}

function getAncestors(el, elementsOnly, elToHTML, doc_head_body, notInShadow){
	let curr=el;
	let ancestors=[el];
	let outAncestors=[];
	let end=false;
	
	while(!end){
		let p=getParent(curr,elementsOnly,doc_head_body);
		if(p!==null){
			if(elToHTML){
				ancestors.push(p);
			}else{
				ancestors.unshift(p)
			}
			curr=p;
		}else{
			end=true;
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

function hasAncestor(el,p){
	if(el===p){
		return true;
	}
	let out=false;
	let curr=el;
	let end=false;
	while(!end){
		let r=getParent(curr,false,true);
		curr=r;
		if(r===null){
			end=true;
		}else if(r===p){
			out=true;
			end=true;
		}
	}
	return out;
}

function expandFrame(frs){
			for(let i=0; i<frs.length; i++){
				let fr=frs[i];
				setStyle(fr,'z-index',Number.MAX_SAFE_INTEGER);
				 
				 
				setStyle(fr,'margin',0);
				setStyle(fr,'border',0);
				setStyle(fr,'padding',0);
		
				setStyle(fr,'max-height','-webkit-fill-available');
				setStyle(fr,'max-width','-webkit-fill-available');
				setStyle(fr,'min-height','100vh');
				setStyle(fr,'height','-webkit-fill-available');
				setStyle(fr,'position','fixed');
				setStyle(fr,'width','-webkit-fill-available');

				setStyle(fr,'left','0px');
			}
}


function messageHdl(request, sender, sendResponse) {
	//console.log(request);
	if(typeof request.type !=='undefined'){
		 if(request.type ==='size'){
			let x=[];
			for(let i=allFrames.length-1; i>=0; i--){
				let ifr=allFrames[i];
				let ifr0=ifr[0];
				if (ifr0.src===request.url || ifr0.getAttribute('data-src')===request.url){
					x=[ifr0,...ifr[3]];
					let hg=request.doc_minHeight+'px';
					x.forEach(f=>{
						setStyle(f,'max-height',hg);
						setStyle(f,'min-height',hg);
						setStyle(f,'height',hg);
					});
					break;
				}
			}
		 }else if(request.type ==='close'){
		if(document.URL!=request.message){
			
					let xfr=null;
		for(let i=0; i<expnd.length; i++){
			if (expnd[i].src===request.message || expnd[i].getAttribute('data-src')===request.message){
				xfr=expnd[i];
				break;
			}
		}
		
		if(!xfr){
			let x=[];
		for(let i=allFrames.length-1; i>=0; i--){
			let ifr=allFrames[i];
			let ifr0=ifr[0];
			if (ifr0.src===request.message || ifr0.getAttribute('data-src')===request.message){
				x=[ifr0,...ifr[3]].filter(xi=>{ return !expnd.includes(xi)});
				expnd.push(...x);
				let xc=x.map(f=>{return window.getComputedStyle(f)});
				expndCSS.push(...xc);
				break;
			}
		}
			
			if(x.length>0){
				expandFrame(x);
			}
		}else{
			let x=[];
		for(let i=allFrames.length-1; i>=0; i--){
			let ifr=allFrames[i];
			let ifr0=ifr[0];
			if (ifr0.src===request.message || ifr0.getAttribute('data-src')===request.message){
				x=[ifr0,...ifr[3]];
				break;
			}
		}

	if(x.length>0){
		for(let k=0; k<x.length; k++){
			let fr=x[k];
			let ix=expnd.indexOf(fr);
			let fc=expndCSS[ix];
			let hg=Math.abs(request.bottom-request.top);
			let wd=Math.abs(request.right-request.left);
			setStyle(fr,'max-height',fc['max-height']);
			setStyle(fr,'max-width',fc['max-width']);
			setStyle(fr,'min-height',fc[' min-height']);
			setStyle(fr,'height',fc['height']);
			setStyle(fr,'width',fc['width']);
			setStyle(fr,'left',fc[ 'left']);
			setStyle(fr,'z-index',fc[ 'z-index']);
			expnd=removeEls(fr, expnd);
			expndCSS=expndCSS.filter((c,idx)=>{return idx!==ix;})
		}
	}
	
		}
	}
	
	
	}else if(request.type ==='expand'){
		if(document.URL==request.message && init===null){
			handleBrowserActionClicked(request);
			init=false;
		}else if(init===false && request.isVid!='true' && fr_id!==null && fr_id!==0){ //hide
			setStyle(ifrm,'display','none');
			setStyle(ifrm2,'display','none');
			setStyle(ifrm3,'display','none');
			init=true;
		}else if(init===true && fr_id!==null && fr_id!==0){ //show
			setStyle(ifrm,'display','flex');
			 setStyle(ifrm2,'display','flex');
			 setStyle(ifrm3,'display','flex');
			 init=false;
		}
	}

	}else{
	
	if(window.location.href==request.message){
	if(init===null){
	 handleBrowserActionClicked(request);
		init=false;
	}else if(init===false && request.isVid!='true' && fr_id!==null && fr_id!==0){ //hide
		setStyle(ifrm,'display','none');
		setStyle(ifrm2,'display','none');
		setStyle(ifrm3,'display','none');
		init=true;
	}else if(init===true && fr_id!==null && fr_id!==0){ //show
		setStyle(ifrm,'display','flex');
		setStyle(ifrm2,'display','flex');
		setStyle(ifrm3,'display','flex');
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
	
	
	let embeds=getMatchingNodesShadow(document,'EMBED',true,false);

emb_to_ifr(embeds);

}


function handleBrowserActionClicked(bgMsg) {

var controls_tag=document.createElement('style');
hed.insertAdjacentElement('afterbegin',controls_tag);

ifrm=document.createElement('iframe');
setStyle(ifrm,'z-index',Number.MAX_SAFE_INTEGER);
setStyle(ifrm,'width','-webkit-fill-available');
setStyle(ifrm,'margin',0);
setStyle(ifrm,'border',0);
setStyle(ifrm,'padding',0);
setStyle(ifrm,'display','flex');
setStyle(ifrm,'visibility','visible');
setStyle(ifrm,'position','absolute');
setStyle(ifrm,'transform','translateY(0px)');


setStyle(ifrm,'top','0.37ch');
setStyle(ifrm,'left','0.66ch');

ifrm2=document.createElement('iframe');
setStyle(ifrm2,'position','absolute');
setStyle(ifrm2,'z-index',Number.MAX_SAFE_INTEGER);
setStyle(ifrm2,'min-width','-webkit-fill-available');
setStyle(ifrm2,'width','-webkit-fill-available');
setStyle(ifrm2,'margin',0);
setStyle(ifrm2,'border',0);
setStyle(ifrm2,'padding',0);
setStyle(ifrm2,'min-height','100vh');
setStyle(ifrm2,'display','flex');
setStyle(ifrm2,'visibility','visible');
setStyle(ifrm2,'background','#121212');
setStyle(ifrm2,'transform','translateY(0px)');
setStyle(ifrm2,'transform-origin','left top');

ifrm3=document.createElement('iframe');
setStyle(ifrm3,'position','absolute');
setStyle(ifrm3,'z-index',Number.MAX_SAFE_INTEGER);
setStyle(ifrm3,'min-height','100vh');
setStyle(ifrm3,'min-width','-webkit-fill-available');
setStyle(ifrm3,'width','-webkit-fill-available');
setStyle(ifrm3,'margin',0);
setStyle(ifrm3,'border',0);
setStyle(ifrm3,'padding',0);
setStyle(ifrm3,'display','flex');
setStyle(ifrm3,'visibility','visible');
setStyle(ifrm3,'transform','translateY(0px)');
setStyle(ifrm3,'transform-origin','left top');

let ht_a=`
<style>
input::-webkit-textfield-decoration-container {
    background: buttonface;
}
</style>
<main style="margin: 0px !important; border: 0px !important; padding: 0px !important; background-color: black !important;">
<button style="background-color: buttonface !important; visibility: initial !important;" id="three_plus" type="button">+ 3 thumbs</button>
<button style="background-color: buttonface !important; visibility: initial !important;" id="three_neg" type="button">- 3 thumbs</button>
<button title="Click to reset to default" style="background-color: buttonface !important; display: none; visibility: initial !important;" type="button" id="every"></button>
<select style="width: 46.6vw; color: black; background-color: buttonface; visibility: initial !important;" name="txt_Bx" id="txt_Bx"></select>

<input style="background-color: buttonface !important; visibility: initial !important;" id="scnB" type="button" Value="Scan for video">
<input style="background-color: buttonface !important; visibility: initial !important;" id="genB" type="button" Value="Select video">
<input style="background-color: buttonface !important; visibility: initial !important;" id="opnVd" type="button" Value="Open link">
<input style="background-color: buttonface !important; visibility: initial !important;" id="hideThumbs" type="button" Value="Hide thumbs">
<input style="background-color: buttonface !important; visibility: initial !important; display: none !important;" id="scroll_curr1" type="button" Value="Scroll to current thumb">
`;

if(typeof bgMsg.top !=='undefined'){
	ht_a+= '<input lft="'+bgMsg.left+'" rgt="'+bgMsg.right+'" tp="'+bgMsg.top+'" btm="'+bgMsg.bottom+'" style="background-color: buttonface !important; visibility: initial !important;" id="rstD" type="button" Value="Toggle maximise">';
}

ht_a+=`
<br>
<span style="color: #dfdfdf !important;font-size: 1.83ch !important;visibility: initial !important;background-color: #f0f0f0d4 !important;" id="frames" title="Scroll here to change number of frames.">24</span>
<span style="color: #dfdfdf !important; font-size: 1.83ch !important; margin-inline-start: 4.4ch !important; visibility: initial !important;background-color: #000000b5 !important;" title="Maximum speed when speeding through; scroll to change.">Max speed: </span>
<input title="Maximum speed when speeding through; scroll to change." type="number" id="mxs" min="1" max="16" step="0.5" value="${plRate_var}" style="width: 9ch !important; background-color: buttonface !important; border-width: 0px !important; visibility: initial !important;"></input>
</main>
`


let ht_c=`
<style>
progress::-webkit-progress-value {
    background-color: #00ffff8f;
}
progress.scrub::-webkit-progress-value {
    background-color: #ff00008f;
}
progress::-webkit-progress-bar {
    background-color: #8080808f;
}
progress.scrub::-webkit-progress-bar {
    background-color: #00ffff8f;
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
<button id="one_col" style="background-color: buttonface !important;">Toggle one column</button>
<button id="mvvb" style="background-color: buttonface !important;">Toggle relocate video</button>
<div contenteditable="true" id="rszr" title="Scaling factor of the thumbs' iframe. Can take fractions, arithmetic etc. (uses CSS' calc function). Wheel over to adjust (if in decimal format) (tip: don't scroll all the way to the bottom of the page before wheeling over)." style="width: -webkit-fill-available;display: none; text-align: center;border-width: 0px 0px 0px 1px;background-color: buttonface;border-style: outset;"></div>

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
var time_track=[-1,0];
var tTrkFlg=false;
var ev_t=-1;
var mx=-3000;
var perc_r;
var perc;
var tbG=false;
var gapVid=9;
var shiftBtns2=null;

var ifrmRsz=()=>{

	 let scR=absBoundingClientRect(sc1);

	let bSectR=absBoundingClientRect(bSect);

	//let mxwb=bSectR.width;
	let mxhb=bSectR.height;
	
	setStyle(ifrm3,'min-width',bsw+'px');
	setStyle(ifrm3,'width',bsw+'px');
	setStyle(ifrm3,'max-width',bsw+'px');

	setStyle(ifrm3,'min-height',mxhb+'px');
	setStyle(ifrm3,'height',mxhb+'px');
	setStyle(ifrm3,'max-height',mxhb+'px');

	let ifrm3R=absBoundingClientRect(ifrm3);
	let wd=getScreenWidth(false);
	
	let i2w=wd-ifrm3R.width;
	setStyle(ifrm3,'left',i2w+'px');
	let ifrm2R=absBoundingClientRect(ifrm2);
	let lbd=(typeof(scrv)!=='undefined')?parseFloat(window.getComputedStyle(scrv)['border-left-width'])-1:0;
	i2w=i2w-ifrm2R.left-lbd;
	setStyle(sc1,'min-width',i2w+'px');
	setStyle(sc1,'width',i2w+'px');
	setStyle(sc1,'max-width',i2w+'px');
	
	setStyle(ifrm2,'min-width',i2w+'px');
	setStyle(ifrm2,'width',i2w+'px');
	setStyle(ifrm2,'max-width',i2w+'px');
	
	let td=(typeof thumbs!=='undefined')?true:false;
	
	if(td){
				setStyle(thumbs,'min-width',i2w+'px');
				setStyle(thumbs,'width',i2w+'px');
				setStyle(thumbs,'max-width',i2w+'px');
				let scts=[...thumbs.children];

			for(let j = 0; j < scts.length; j++){
				
				let figs=[...scts[j].children];

				if(!isOneCol){
					let sctW=0;
					for (let i = 0; i < figs.length; i++) {
						sctW+=figs[i].scrollWidth*parseFloat(figs[i].getAttribute('three_sect_zoom'));
					}
					fPrp=(sctW==0)?1:(i2w/(sctW/figs.length))* (1/3);
					setStyle(scts[j],'zoom',fPrp);
				}else{
					setStyle(scts[j],'zoom',i2w/(scts[j].getBoundingClientRect().width));
				}
			}
	}
		
	if(shiftBtns2!==null){
		shiftBtns2();
	}
	
	
	let sc1R=absBoundingClientRect(sc1);
	let h=getScreenHeight(false);
	h=h-sc1R.top;
	h=(h<0 ||  h<sc1R.height)?sc1R.height:h;
	
	setStyle(ifrm2,'min-height',h+'px');
	setStyle(ifrm2,'height',h+'px');
	setStyle(ifrm2,'max-height',h+'px');

}

var rsz_ifrm=()=>{
	let mainRct=absBoundingClientRect(main); 
	if(!!firstAncestor){
		setStyle(firstAncestor,'transform-origin','left bottom');
		setStyle(firstAncestor,'transform','scale(0.97) translateY('+mainRct.height+'px)');
		let ifR=absBoundingClientRect(ifrm);
		
		let fprc=absBoundingClientRect(firstParent);
		let vrc=absBoundingClientRect(myVdo);
		
		let tp=Math.max(fprc.bottom,vrc.bottom,ifR.bottom)+gapVid;
		setStyle(ifrm2,'top',tp+'px');
		setStyle(ifrm3,'top',tp+'px');
		setStyle(ifrm2,'left','0.22%');
	}
	
	setStyle(ifrm,'height',(mainRct.height)+'px');
}

setStyle(ifrm.contentWindow.document.body,'margin',0);
setStyle(ifrm.contentWindow.document.body,'border',0);
setStyle(ifrm.contentWindow.document.body,'padding',0);
setStyle(ifrm.contentWindow.document.body,'display','inline-flex');
setStyle(ifrm.contentWindow.document.documentElement,'display','inline-table');

setStyle(ifrm2.contentWindow.document.body,'margin',0);
setStyle(ifrm2.contentWindow.document.body,'border',0);
setStyle(ifrm2.contentWindow.document.body,'padding',0);
setStyle(ifrm2.contentWindow.document.body,'overflow','hidden');

setStyle(ifrm3.contentWindow.document.body,'margin',0);
setStyle(ifrm3.contentWindow.document.body,'border',0);
setStyle(ifrm3.contentWindow.document.body,'padding',0);

var main=ifrm.contentWindow.document.getElementsByTagName("main")[0];
let mainRct=absBoundingClientRect(main);

setStyle(ifrm,'min-height',(mainRct.height)+'px');
setStyle(ifrm,'height',(mainRct.height)+'px');

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


setStyle(ifrm2,'top',maxBtm+'px');
setStyle(ifrm3,'top',maxBtm+'px');
ifrm.scrollIntoView({behavior: "instant", block: 'start', inline: "start"});

var sc1=ifrm2.contentWindow.document.getElementsByTagName("section")[0];
setStyle(sc1,'min-width','100%');
setStyle(sc1,'width','100%');
var frame_btn=ifrm.contentWindow.document.querySelectorAll("span#frames")[0];
var three_Plus=ifrm.contentWindow.document.querySelectorAll("button#three_plus")[0];
var three_Neg=ifrm.contentWindow.document.querySelectorAll("button#three_neg")[0];
var mxsp=ifrm.contentWindow.document.querySelectorAll("input#mxs")[0];


var myVdo;
var vMut=null;
var wndWh=false;
var shb2=false;
var figSk=false;
var myVdo_el=[];

var bSect=ifrm3.contentWindow.document.querySelectorAll("section#bSec")[0];
var mvdb=ifrm3.contentWindow.document.querySelectorAll("button#mvvb")[0];
var oneCol=ifrm3.contentWindow.document.querySelectorAll("button#one_col")[0];
var rlcRsz=ifrm3.contentWindow.document.querySelectorAll("div#rszr")[0];
rlcRsz.innerText=relocScale_var.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 15});

rlcRsz.oninput=(e)=>{
	relocScale_var=rlcRsz.innerText;
	shb2=false;
	shiftBtns2();
	//postRsz=true;
};

rlcRsz.onwheel=(e)=>{
	e.preventDefault();
	e.stopPropagation();
	let dec=(rlcRsz.innerText.match(/^\d*(\.\d*)?$/)!==null)?true:false;
	if(dec===true){
		let fl=parseFloat(rlcRsz.innerText);
		if(e.deltaY>0){
			rlcRsz.innerText=(Math.max(0,Math.min(1,fl-0.01))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 15});
		}
		if (e.deltaY<0){
			rlcRsz.innerText=(Math.max(0,Math.min(1,fl+0.01))).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 15});
		}
	}
	//relocScale_var=rlcRsz.innerText;
	rlcRsz.dispatchEvent(new Event('input'));
	//postRsz=true;
};

var bsw=0;

ifrmRsz();

/*let sc1w=(absBoundingClientRect(bSect).left-mgLft).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false});

 setStyle(sc1,'min-width',sc1w+'px');
 setStyle(sc1,'width',sc1w+'px');
 setStyle(sc1,'max-width',sc1w+'px');*/
let suppressScr=false;
//let zeroRsz=false;
function scrollElMidPage(el,p){
	if(typeof(p)!=='undefined'){
		p.scrollIntoView({behavior: "instant", block: 'start', inline: "start"});
		sy=getScrollY();
		scrollElMidPage(el);
		sy2=getScrollY();
		if(sy2<sy){
			p.scrollIntoView({behavior: "instant", block: 'start', inline: "start"});
		}else{
			p.scrollIntoView({behavior: "instant", block: 'end', inline: "start"});
			sy=getScrollY();
			if(sy<sy2){
				el.scrollIntoView({behavior: "instant", block: 'end', inline: "start"});
			}else{
				scrollElMidPage(el);
			}
		}
	}else{
		el.scrollIntoView({behavior: "instant", block: 'center', inline: "start"});
	}
}

var thumbs=ifrm2.contentWindow.document.querySelectorAll("div#thumbs")[0];


function figSize(f,g,x){ //figure,
	if(f===null){
		if(!isOneCol){
			let allFigs=thumbs.getElementsByTagName('FIGURE');
			for(let i=0, len=allFigs.length; i<len; i++){
				let fi=allFigs[i];
				setStyle(fi,'zoom',fi.getAttribute('three_sect_zoom'));
				setStyle(fi,'height',"");
			}
		}
	}else{
		currentFig=f;
		if(justSeek===true){
			justSeek=false;
			scrollElMidPage(f,ifrm2);
		}
		if(psDiv!==null && x!==null && typeof(x)!=='undefined'){
			let figSt=(x/done_t)*100;
			let figEnd=((x+1)/done_t)*100;
			setStyle(psDiv,'background',`linear-gradient(to right, #00ffff99 0%,#00ffff99 ${figSt}%,#ff000099 ${figSt}%,#ff000099 ${figEnd}%,#00ffff99 ${figEnd}%)`);
		}
		if(!isOneCol){
			let sct=f.parentElement;
			let allFigs=thumbs.getElementsByTagName('FIGURE');
			for(let i=0, len=allFigs.length; i<len; i++){
				let fi=allFigs[i];
				if(fi.parentElement!==sct){
						setStyle(fi,'zoom',fi.getAttribute('three_sect_zoom'));
				}else{
					if(f!==fi){
						setStyle(fi,'zoom',getFloat(fi.getAttribute('three_sect_zoom'))*0.75);
						setStyle(fi,'height',(fi.getBoundingClientRect().height*2)+'px'); //*1.5*(1/0.75)
					}else{
						setStyle(fi,'zoom',getFloat(fi.getAttribute('three_sect_zoom'))*1.5);
					}
				}
			}
		}
		if(suppressScr===true){
			suppressScr=false;
			if(!myVdo.ownerDocument.pictureInPictureElement && !vfr){
				scrollElMidPage(myVdo);
			}else{
				scrollElMidPage(f,ifrm2);
			}	
		}
	}
	ifrmRsz();
	if(g===true){
		scrollElMidPage(f,ifrm2);
	}
}

setStyle(thumbs,'transform-origin','top left');
var threeSct=thumbs.firstChild;
setStyle(thumbs,'margin',0);
setStyle(thumbs,'border',0);
setStyle(thumbs,'padding',0);

var scrl=ifrm3.contentWindow.document.querySelectorAll("button#scroll_curr")[0];
var scrv= ifrm3.contentWindow.document.querySelectorAll("button#scroll_vid")[0];
var spb= ifrm3.contentWindow.document.querySelectorAll("button#spdt")[0];
var pip= ifrm3.contentWindow.document.querySelectorAll("button#pnp")[0];
var curr=ifrm3.contentWindow.document.querySelectorAll("div#currTime")[0];

var scrl1=ifrm.contentWindow.document.querySelectorAll("input#scroll_curr1")[0];
var evry= ifrm.contentWindow.document.querySelectorAll("button#every")[0];
var scanB= ifrm.contentWindow.document.querySelectorAll("input#scnB")[0];
var gnrB= ifrm.contentWindow.document.querySelectorAll("input#genB")[0];

var opnr= ifrm.contentWindow.document.querySelectorAll("input#opnVd")[0];
var hide_thumbs= ifrm.contentWindow.document.querySelectorAll("input#hideThumbs")[0];

hide_thumbs.onclick=()=>{
	let og_vfr=vfr;
	if(vfr){
		mvdb.click();
	}
	let s=false;
	let d='none';
	let t='Show thumbs'
	if(tHidden===true){
		d='flex';
		s=true;
		t='Hide thumbs'
	}else{
		tHidden_vfr=og_vfr;
	}
	tHidden=!tHidden;
	hide_thumbs.value=t;
	setStyle(ifrm2,'display',d);
	setStyle(ifrm3,'display',d);
	if(s===true){
		ifrm2.scrollIntoView({behavior: "instant", block: 'start', inline: "start"});
		if(tHidden_vfr===true){
			vfr=false;
			mvdb.click();
		}
		rsz();
	}
};

var clse;

try{
	clse=ifrm.contentWindow.document.querySelectorAll("input#rstD")[0];
	clse.onclick=()=>{
					let undAnc=(typeof(firstAncestor)==='undefined' || !firstAncestor)?true:false;
					let faRect=(undAnc)?0:absBoundingClientRect(firstAncestor);
					
					exBool=(exBool)?false:true;
					doc_minHeight=Math.max(
						((doc_minHeight===null)?0:doc_minHeight),
						parseFloat(window.getComputedStyle(document.documentElement)['min-height']),
						absBoundingClientRect(ifrm2).bottom,
						absBoundingClientRect(ifrm3).bottom,
						(undAnc)?0:faRect.bottom/( faRect.height / firstAncestor.offsetHeight)
					);
					let tp=parseFloat(clse.attributes.tp.value)
					chrome.runtime.sendMessage({msg: clse.ownerDocument.URL, left: parseFloat(clse.attributes.lft.value), right: parseFloat(clse.attributes.rgt.value), top: tp, bottom: (exBool===false)?tp+doc_minHeight:parseFloat(clse.attributes.btm.value), type:'close', boolMrk:exBool}, function(response){});
	}
}catch(e){;}

var sp_swtch=0;

var txtBx = ifrm.contentWindow.document.querySelectorAll('select#txt_Bx')[0];
//var pgrCSS = ifrm2.contentWindow.document.querySelectorAll('style#pgrB')[0];
var vids=[];
var vhw={w:0,h:0};

var ancsRsz= ()=>{
	firstAncestorIFR=null;
	g_ancestors=getAncestors(myVdo,true,true,false,true);
	let fa=g_ancestors.at(-1);
	if(fa.ownerDocument!==document){
		for(let i=allFrames.length-1; i>=0; i--){
			let fri=allFrames[i][0]
			if(myVdo_el[1].includes(allFrames[i][2]) && myVdo_el[1]!='' && document.documentElement.contains(fri)){
				g_ancestors=getAncestors(fri,true,true,false,true);
				firstAncestorIFR=fri;
				fa=g_ancestors.at(-1);
				break
			}
		}
	}
	if(fa.ownerDocument===document){
		firstParent=g_ancestors[((g_ancestors.length==1)?0:1)];
		firstAncestor=fa;
		vfr=false;
		let ifrc=absBoundingClientRect(main);
	
		setStyle(firstAncestor,'transform-origin','left bottom');
		setStyle(firstAncestor,'transform','scale(0.97) translateY('+ifrc.height+'px)');
		let ifR=absBoundingClientRect(ifrm);
		let fprc=absBoundingClientRect(firstParent);
		let vrc=absBoundingClientRect(myVdo);
		
		let tp=Math.max(fprc.bottom,vrc.bottom,ifR.bottom)+gapVid;
		setStyle(ifrm2,'top',tp+'px');
		setStyle(ifrm3,'top',tp+'px');
		setStyle(ifrm2,'left','0.22%');
		ifrmRsz();
	}else{
		firstParent=null;
		firstAncestor=null;
		firstAncestor_zIndex=null;
	}
}

function scrollHdl(){
	let scrollTop=getScrollY();
	let ifrm2R=absBoundingClientRect(ifrm2);
	scrollTop=( (scrollTop>ifrm2R.top)? scrollTop : ifrm2R.top );
	setStyle(ifrm3,'top',(scrollTop+1)+'px');
}
			
var shiftVid=(force_default_place)=>{
		if(force_default_place){ //put video back in original location
				controls_tag.innerHTML=``;//-
				if(!!firstAncestor && firstAncestor.getAttribute('css_txt')!==null){
					firstAncestor.style.cssText=firstAncestor.getAttribute('css_txt');
				}
			
			let p=ifrm2.style.cssText.split(/transform\s*\:\s*[^\!]*/);
						 ifrm2.style.cssText=p.join('transform: translateY(0px) ');
		}else{
							if(!!firstAncestor && firstAncestor.getAttribute('css_txt')===null){
								firstAncestor.setAttribute('css_txt',firstAncestor.style.cssText);
							}
							
							let p=ifrm2.style.cssText.split(/transform\s*\:\s*[^\!]*/);
							if(p.length<2){
								let x=p[0]+' transform: scale(calc('+relocScale_var+')) !important;';
								ifrm2.style.cssText=(p[0].trim().endsWith(';'))?x:`;${x}`;
							}else{
								ifrm2.style.cssText=p.join('transform: scale(calc('+relocScale_var+')) ');
							}
							scrollHdl();
							/*try{
								if(postRsz){
									postRsz=false;
									scrollElMidPage(currentFig,ifrm2);
								}
							}catch(e){;}*/
							let ifrm2R=absBoundingClientRect(ifrm2);
							let ifrm3R=absBoundingClientRect(ifrm3);
							//let wdt=getScreenWidth();
							
							let vw=ifrm3R.left-ifrm2R.right;
							let vw2=vw*0.034;
							let myVdoR;
							let fGap=vw-vw2-2;
							let s=fGap/myVdo.clientWidth;
							
							if(!!firstAncestor){
								firstAncestor.style.cssText='';
								if(typeof(firstAncestor_wh['width']!=='undefined')){
									setFA_wh(firstAncestor_wh);
								}
								setStyle(firstAncestor,'position','fixed');	
								setStyle(firstAncestor,'top','1px');	
								setStyle(firstAncestor,'left','-2px');
								setStyle(firstAncestor,'transform-origin','top left');
								setStyle(firstAncestor,'z-index',Number.MAX_SAFE_INTEGER-1);
								let mvl=(firstAncestorIFR!==null)?firstAncestorIFR:myVdo;
								myVdoR=mvl.getBoundingClientRect();
								let faRect=firstAncestor.getBoundingClientRect();
								s=fGap/((myVdoR.width/faRect.width)*firstAncestor.clientWidth);
								let psGap=(pointerScrub_var!==0)?5.5:0;
								let psdr=(pointerScrub_var!==0)?psDiv.getBoundingClientRect():{height:0};
								let shgt=document?.documentElement?. clientHeight-1-psGap-psdr.height;
								myVdoR=mvl.getBoundingClientRect();
								//centre
								myVdoR.centre_y=myVdoR.top+myVdoR.height*0.5;
								let wScl=myVdoR.width/myVdo.videoWidth;
								let hScld=wScl*myVdo.videoHeight;
								//myVdoR.vid_top=myVdoR.centre_y-0.5*(hScld);
								let sch=hScld*s;
								if(sch>shgt){ //overshoot
									s*=(shgt/sch);
								}							
									
								setStyle(firstAncestor,'transform','scale('+s+')');
								myVdoR=absBoundingClientRect(mvl);
								myVdoR.centre_y=myVdoR.top+myVdoR.height*0.5;
								wScl=myVdoR.width/myVdo.videoWidth;
								hScld=wScl*myVdo.videoHeight;
								let hlf=0.5*(hScld);
								myVdoR.vid_top=myVdoR.centre_y-hlf;
								myVdoR.vid_bottom=myVdoR.centre_y+hlf;
								controls_tag.innerHTML=`video::-webkit-media-controls {transform: translateY(${(myVdoR.vid_bottom-myVdoR.bottom)/s}px) !important;}`;//-
								
								tx=((ifrm2R.right+vw2)-myVdoR.left)/s;
								ty=(ifrm3R.top-myVdoR.vid_top+1)/s;
								// myVdoR.top/left unaffected by scale because of transform-origin
								setStyle(firstAncestor,'transform','scale('+s+') translateX('+(tx)+'px) translateY('+(ty)+'px)');
								
								if(pointerScrub_var!==0){
									myVdoR=absBoundingClientRect(mvl);
									myVdoR.centre_y=myVdoR.top+myVdoR.height*0.5;
									wScl=myVdoR.width/myVdo.videoWidth;
									hScld=wScl*myVdo.videoHeight;
									myVdoR.vid_bottom=myVdoR.centre_y+0.5*(hScld);
									setStyle(psDiv,'top',((
										myVdoR.vid_bottom+psGap
									))+'px');
									setStyle(psDiv,'left',((
										myVdoR.left
									))+'px');
									setStyle(psDiv,'width',`${myVdoR.width}px`);
								}
							}
		}
}

var rsz= ()=>{
	ifrmRsz();
}

evry.onclick=()=>{
	if (aseek==0){
		if(evry.intrv!==null){
			if(evry.intrv<0){
					evry.intrv=-0.5;
					evry.innerText='At most every 0.5 secs';
			}else{
					evry.intrv=everyX_var;
					evry.innerText=evry.innerText=`At least every ${everyX_var} secs`;
			}
		}
		rsz_ifrm();
		setEveryFrames();
	}
}

evry.onwheel=()=>{
	event.preventDefault();
	event.stopPropagation();
	if(evry.intrv===null || aseek!=0){
		return
	}
	
	if (event.deltaY>0){
		if(evry.intrv<0){
			evry.intrv=(evry.intrv<=-0.2)?evry.intrv+0.1:evry.intrv;
			evry.innerText='At most every '+(	Math.abs(evry.intrv).toLocaleString('en-GB', {minimumFractionDigits: 1, maximumFractionDigits: 1})	)+' secs';
		}else{
			if(evry.intrv>=2){
				evry.intrv-=1;
			}
			evry.innerText='At least every '+(evry.intrv)+((evry.intrv===1)?' sec':' secs');
		}
	}
	
	if(event.deltaY<0){
		if(evry.intrv<0){
			evry.intrv-=0.1;
			evry.innerText='At most every '+(	Math.abs(evry.intrv).toLocaleString('en-GB', {minimumFractionDigits: 1, maximumFractionDigits: 1})	)+' secs';
		}else{
			evry.intrv+=1;
			evry.innerText='At least every '+(evry.intrv)+((evry.intrv===1)?' sec':' secs');
		}
	}
		
	setEveryFrames();
	rsz_ifrm();
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
	if(ev.buttons>0 && typeof(ths)!=='undefined'){
		ev.preventDefault();
		ev.stopPropagation();
		nowFlag=ix;
		let cur=parseFloat(attr.timestamp.nodeValue);
		let rct=absBoundingClientRect(ths);
		let fg=captions[ix].parentElement.parentElement;
		let sct=fg.parentElement;
		let fz=fg.style.zoom;
		let pfz=getFloat(fz);
		//let z=( isNaN(pfz) || isOneCol)?1:0.01*pfz;
		let fct=getFloat(sct.style.zoom);
		progresses[ix].value=ev.offsetX/(rct.width*fct*pfz);
		vidSeek=false;
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
				evry.intrv=everyX_var;
				t=Math.round(Math.ceil(((myVdo.duration)/(everyX_var*3)))*3);
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
				evry.innerText=`At least every ${everyX_var} secs`;
			}else if(myVdo.duration<4.5){
				evry.intrv=-0.5;
				t=Math.round(Math.max(1,Math.floor((myVdo.duration*2)/3))*3); // 2 => (1/*0.5)
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
				evry.innerText='At most every 0.5 secs';
			}else{ //>=4.5 && <270
				evry.intrv=null;
				t=9;
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
				evry.innerText='9 frames';
			}
			ev_t=t;
			setStyle(evry,'display','initial');
			}
	}
	if(vMut!==null){
		myVdo.pause();
		myVdo.muted =vMut; //set to og mute status
		vMut=null;
	}
	bsw=0;
	vidSeek=false;
	myVdo.currentTime=0;

	if(!tTrkFlg){
	setStyle(bSect,'width','min-content');
	setStyle(bSect,'min-width','');
	setStyle(bSect,'max-width','');
	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	let bSectR=absBoundingClientRect(bSect);
	let bsrw=bSectR.width
	bsw=(bsrw>bsw)?bsrw:bsw;
	setStyle(bSect,'width',bsw+'px');
	setStyle(bSect,'min-width',bsw+'px');
	setStyle(bSect,'max-width',bsw+'px');
	ifrmRsz();
	}
}

function shiftBtns(bool){
	try{
		if(bool){
			let r=absBoundingClientRect(mvdb);
			setStyle(pip,'top',(r.top-r.height-2)+'px');
			r=absBoundingClientRect(oneCol);
			setStyle(oneCol,'top',(r.top-r.height-2)+'px');
			r=absBoundingClientRect(pip);
			setStyle(spb,'top',(r.top-r.height-2)+'px');
			r=absBoundingClientRect(spb);
			setStyle(scrv,'top',(r.top-r.height-2)+'px');
			r=absBoundingClientRect(scrv);
			setStyle(scrl,'top',(r.top-r.height-2)+'px');
		}
	}catch(e){;}
}

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
	event.preventDefault();
	//event.stopPropagation();
	if(event.deltaY>0){
		vidSeek=false;
	   myVdo.currentTime -= (myVdo.duration/t)*0.05;
	}
	if (event.deltaY<0){
		vidSeek=false;
		myVdo.currentTime +=  (myVdo.duration/t)*0.05;
	}
}

window.addEventListener('pointerdown', function (event) {
	if(last_psTime[0]!==null){
		event.preventDefault();
		event.stopPropagation();
		last_psTime[0].click();
		myVdo.play();
		for(let i=0, len=currFigCaps.length; i<len; i++ ){
			try{
				let fgi=currFigCaps[i];
				let fi=fgi[0];
				let pi=fgi[1];
				setStyle(fi,'background-color','#00000099');
				setStyle(fi,'color','white');
				pi.className='';
			}catch(e){;}
		}
		currFigCaps=[];
		last_psTime=[null,false,null];
	}
});

window.addEventListener('pointermove', function (event) {
		let rst=false;
		if(psDiv!==null && firstAncestor!==null /*&& myVdo.paused*/ && myVdo.readyState>0 && captions.length==done_t && aseek==0 && isOneCol && vfr){
			let res;
			let ent=false;
			let psRect=absBoundingClientRect(psDiv);
			let evX=event.pageX;
			let vrl=psRect.left;
			let vrr=psRect.right;
			let vrt=psRect.top;
			let vrb=psRect.bottom;
			let evY=event.pageY;
			if(evY>=vrt && evY<=vrb){
				let ivLerp= (evY - vrt)/(vrb - vrt);
				if(evX>=vrl && evX<=vrr){
					res= (evX - vrl)/(vrr - vrl);
					ent=true;
				}
			}
			if(scrubEnt===true && ent===false){
				scrubEnt=ent;
				scrl.click();
				rst=true;
			}else if(ent===true){
				scrubEnt=ent;
				let cap1=res*done_t;
				let cap_el1=Math.floor(cap1);
				
				let sy,sy2,zeroRct,figEl,prg;
				if (cap_el1+1<captions.length){
					prg=progresses[cap_el1];
				}else{
					prg=progresses.at(-1);
				}
				let cvsEl=prg.parentElement.previousElementSibling;
				figEl=cvsEl.parentElement;
				last_psTime[0]=figEl;
				last_psTime[2]=figEl.lastElementChild.lastElementChild;
				let currFigCap=prg.nextElementSibling;
				psDiv.title=currFigCap.innerText;
				for(let i=0, len=currFigCaps.length; i<len; i++ ){
					try{
						let fgi=currFigCaps[i];
						let fi=fgi[0];
						let pi=fgi[1];
						setStyle(fi,'background-color','#00000099');
						setStyle(fi,'color','white');
						pi.className='';
					}catch(e){;}
				}
				currFigCaps=[];
				try{
					setStyle(currFigCap,'background-color','#00ffff99');
					setStyle(currFigCap,'color','red');
					prg.className='scrub';
					currFigCaps.push([currFigCap,prg]);
				}catch(e){;}
					scrollElMidPage(figEl,ifrm2);
					last_psTime[1]=true;
					//myVdo.currentTime=last_psTime[0];
			}else{
				scrubEnt=ent;
				rst=true;
			}
		}else{
			scrubEnt=false;
			rst=true;
		}
		
		if(rst===true){
			for(let i=0, len=currFigCaps.length; i<len; i++ ){
					try{
						let fgi=currFigCaps[i];
						let fi=fgi[0];
						let pi=fgi[1];
						setStyle(fi,'background-color','#00000099');
						setStyle(fi,'color','white');
						pi.className='';
					}catch(e){;}
			}
			currFigCaps=[];
			last_psTime=[null,false,null];
		}
});

window.addEventListener('resize', function () {
	rsz();
	rsz_ifrm();
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
	scrollElMidPage(captions[curr_thumb].parentElement.parentElement,ifrm2);
};

scrl1.onclick=function(){
	scrollElMidPage(captions[curr_thumb].parentElement.parentElement,ifrm2);
};

scrv.onclick=function(){
	scrollElMidPage(myVdo);
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
ifrmRsz();
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
				/*if(ev_t>-1 && t!=ev_t){
					setStyle(evry,'display','initial');
				}else{
					setStyle(evry,'display','none');
				}*/
		}
	}

	function setMinusFrames() {
		if (aseek==0){
		t=(t<6)?3:t-3;
		frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			/*if(ev_t>-1 && t!=ev_t){
				setStyle(evry,'display','initial');
			}else{
				setStyle(evry,'display','none');
			}*/
		}
	}	
	
	function setEveryFrames() {
			if(myVdo.duration>=270){
				t=Math.round(Math.ceil(((myVdo.duration)/(evry.intrv*3)))*3);
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;			
			}else if(myVdo.duration<4.5){
				t=Math.round(Math.max(1,Math.floor((myVdo.duration*(1/Math.abs(evry.intrv)))/3))*3);
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			}else{
				t=9;
				frame_btn.innerHTML =(loadFlag===true)?t+" - Thumbnails every: "+formatTime(myVdo.duration/t,2):t;
			}
			/*if(ev_t>-1 && t!=ev_t){
				setStyle(evry,'display','initial');
			}else{
				setStyle(evry,'display','none');
			}*/
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


		let vids0=getMatchingNodesShadow(document,'VIDEO',true,false);
		for (let k=0; k<vids0.length; k++){
			vids.push([vids0[k],'']);
		}


	let frms=getMatchingNodesShadow(document,'IFRAME',true,false);
	
		if(!!frms && frms.length>0){
		for (let k=0; k<frms.length; k++){
			allFrames.push([frms[k],1,',f'+gene+',',[]]);
			gene++;
		}
		}

if(allFrames.length>0){
	while(allFrames.map(function(v){return v[1]}).reduce(function(a,b) {return a + b})>0){
		for(let j=allFrames.length-1; j>=0; j--){
			if(allFrames[j][1]==1){
		let frms1=getContainedFrames(allFrames[j]); 
		allFrames[j][1]=0;
		if(!!frms1 && frms1.length>0){
		for (let k=0; k<frms1.length; k++){
				allFrames.push([frms1[k],1,allFrames[j][2]+',f'+gene+',',	[frms1[k],...allFrames[j][3]]	]);
				gene++;
			}
		}
	}
	}
	}
}

	for(let j=allFrames.length-1; j>=0; j--){
		let aj=allFrames[j];
		let aj0=aj[0];
		let aj3=aj[3];
		let ifr;
		try{
			ifr=((	typeof(aj0.frameElement)!=='undefined'	&& !(typeof(aj0.nodeName)!=='undefined'	&& aj0.nodeName==="IFRAME" 	))?aj0.frameElement:aj0);
		}catch(e){ifr=aj0;}
		
		allFrames[j][0]=ifr
		
		for (let k=0; k<aj3.length; k++){
			aj3k=aj3[k];
			let ifr;
			try{
				ifr=((	typeof(aj3k.frameElement)!=='undefined'	&& !(typeof(aj3k.nodeName)!=='undefined'	&& aj3k.nodeName==="IFRAME" 	))?aj3k.frameElement:aj3k);
			}catch(e){ifr=aj3k;}
			allFrames[j][3][k]=ifr
		}
		
	}
	for(let j=allFrames.length-1; j>=0; j--){
		let vids1=[];
		
		try{
					vids1=getMatchingNodesShadow(allFrames[j][0].document,'VIDEO',true,false);
		}catch(e){
			try{
				vids1=getMatchingNodesShadow(allFrames[j][0].contentDocument,'VIDEO',true,false);
			}catch(e){;}
		}	
		
		for (let k=0; k<vids1.length; k++){
			vids.push([vids1[k],allFrames[j][2],allFrames[j]]);
		}
	}

		let filt_vid=[];
		for (let k=0; k<vids.length; k++){
			if(!!isFinite(vids[k][0].duration)){
				filt_vid.push([vids[k][0],vids[k][1]]);
				if(vids[k].length===3){
					allFrames=removeEls(vids[k][2], allFrames);
					allFrames.push(vids[k][2]);
				}
			}
		}	
		
		vids=[...filt_vid];		
				
			 for(let j=allFrames.length-1; j>=0; j--){
				 let frame=allFrames[j];
			 try{
				 
				 if(!!frame[0].src && frame[0].src!='' && frame[0].src!='about:blank' && frame[0].src!='javascript:false'&& frame[0].src!='javascript:true' && frame[0]!==ifrm && frame[0]!=ifrm2 && frame[0]!=ifrm3){
					 	setStyle(frame[0],'visibility','visible');
						let opt = document.createElement('option');
						opt.textContent=frame[0].src;
						opt.setAttribute("index", '-'+j);
						opt.setAttribute("isVid", false);
						opt.setAttribute("link", frame[0].src);
						opt.style.cssText='color: black !important;';
						txtBx.appendChild(opt);	
			tbG=false;
		   gnrB.value='Select video';
				 }
				}catch(e){;}			

				try{
				 if(!!frame[0].getAttribute('data-src') && frame[0].getAttribute('data-src')!='' && frame[0].getAttribute('data-src')!='about:blank' && frame[0].getAttribute('data-src')!='javascript:false'&& frame[0].getAttribute('data-src')!='javascript:true' && frame[0]!==ifrm && frame[0]!=ifrm2 && frame[0]!=ifrm3){
					 	setStyle(frame[0],'visibility','visible');
						let opt = document.createElement('option');
						opt.textContent=frame[0].getAttribute('data-src');
						opt.setAttribute("index", '-'+j);
						opt.setAttribute("isVid", false);
						opt.setAttribute("link", frame[0].getAttribute('data-src'));
						opt.style.cssText='color: black !important;';
						txtBx.appendChild(opt);	
						tbG=false;
						gnrB.value='Select video';
				 }
				}catch(e){;}

			 }

			

	let pxs=0;
	let drt=0;
	  vids.forEach((vid,index) => {
    let opt = document.createElement('option');
	opt.setAttribute("index", index);
	let lk=vidSrc(vid[0]);
	opt.setAttribute("link", lk);
	opt.setAttribute("isVid", true);
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
	let sndHide=true;
	if(txtBx.children.length>0){
		let selIx=txtBx[txtBx.selectedIndex].getAttribute('index');
		let mnz=false;
		let tIx,tIx_el;
		if(selIx==='-0'){
			mnz=true;
			tIx=0;
			tIx_el=0;
		}else{
			tIx=parseInt(selIx);
			tIx_el=Math.abs(selIx);
		}
		
		let frEl=allFrames[tIx_el][0];
		if(tIx<0 || mnz){
			if(!expnd.includes(frEl)){
			let frct=absBoundingClientRect(frEl);
			
			myVdo_el=[];
			myVdo=null;
			firstAncestor=null;
			firstAncestorIFR=null;
			curr_thumb=0;
			loadFlag=false;
			ttmp=0;
			ev_t=-1;
			captions=[];
			progresses=[];
			curr_thumb=0;
			thumbs.innerHTML = '<section style="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;align-items: flex-end !important;"></section>';
			threeSct=thumbs.firstChild;
			setStyle(scrl,'display','none');
			setStyle(scrl1,'display','none');
			shiftBtns(true);
			setStyle(rlcRsz,'display','none');
			setStyle(mvdb,'display','none');
			setStyle(oneCol,'display','none');
			if(pointerScrub_var!==0){
				try{
					elRemover(psDiv);
				}catch(e){;}
				psDiv=null;
			}
			scrubEnt=false;
			last_psTime=[null,false,null];
			isOneCol=false;
			setStyle(document.documentElement,'min-height',doc_minHeight+'px');
			//checkDur();
			tbG=false;
			frame_btn.innerHTML=24;
			setStyle(evry,'display','none');
			gnrB.value='Select video';
			sndHide=false;
			chrome.runtime.sendMessage({msg: txtBx[txtBx.selectedIndex].attributes.link.value,isVid: txtBx[txtBx.selectedIndex].getAttribute('isVid'), left: frct.left, right: frct.right, top: frct.top, bottom: frct.bottom, type: 'expand'}, function(response){
			 gnrB.value='iFrame expanded!';
			let x=[frEl,...allFrames[tIx_el][3]].filter(xi=>{ return !expnd.includes(xi)});
			 expandFrame(x);
				
			/*frEl.scrolling="yes";
			frEl.allowfullscreen="true"; 
			frEl.webkitallowfullscreen="true"; 
			frEl.mozallowfullscreen="true";*/
			
			expnd.push(...x);
			let xc=x.map(f=>{return window.getComputedStyle(f)});
			expndCSS.push(...xc);
			});
		}
		}else if(!tbG){
		curr_thumb=0;
		loadFlag=false;
		ttmp=0;
		ev_t=-1;
		setStyle(document.documentElement,'min-height',doc_minHeight+'px');
		/*let txtVal=txtBx.value;
		alert(txtVal);  
		vid.src = txtVal;      
		myVdo.load(); 
		myVdo.pause();*/
		myVdo_el=vids[tIx_el];
		myVdo=myVdo_el[0];
		
		
		ancsRsz();
			
		shiftBtns(true);

		setStyle(thumbs,'visibility','visible');
		vrc= absBoundingClientRect(myVdo);

		ifrm.scrollIntoView({behavior: "instant", block: 'start', inline: "start"});
		

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
	setStyle(bSect,'width','min-content');
	setStyle(bSect,'min-width','');
	setStyle(bSect,'max-width','');
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	let bSectR=absBoundingClientRect(bSect);
	let bsrw=bSectR.width
	bsw=(bsrw>bsw)?bsrw:bsw;
	setStyle(bSect,'width',bsw+'px');
	setStyle(bSect,'min-width',bsw+'px');
	setStyle(bSect,'max-width',bsw+'px');
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
	setStyle(bSect,'width','min-content');
	setStyle(bSect,'min-width','');
	setStyle(bSect,'max-width','');
 	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	let bSectR=absBoundingClientRect(bSect);
	let bsrw=bSectR.width
	bsw=(bsrw>bsw)?bsrw:bsw;
	setStyle(bSect,'width',bsw+'px');
	setStyle(bSect,'min-width',bsw+'px');
	setStyle(bSect,'max-width',bsw+'px');
	ifrmRsz();
	}
	if(myVdo.readyState>2){
	calcSp();
	}
});		

		 for(let j=allFrames.length-1; j>=0; j--){
				 let frame=allFrames[j];
			 try{
					if(!myVdo_el[1].includes(frame[2]) && myVdo_el[1]!='' && frame[0]!==ifrm && frame[0]!==ifrm2 && frame[0]!==ifrm3 && typeof(frame[0].style)!=='undefined'){
						if(typeof frame[0].style.setProperty!=='undefined'){
							setStyle(frame[0],'display','none');
						}else{
							setStyle(frame[0],'display','none');
						}
					}
			 }catch(e){;}
		 }

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
		thumbs.innerHTML = '<section style="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;align-items: flex-end !important;"></section>';
		threeSct=thumbs.firstChild;
		setStyle(scrl,'display','none');
		setStyle(scrl1,'display','none');
		shiftBtns(true);
		setStyle(rlcRsz,'display','none');
		setStyle(mvdb,'display','none');
		setStyle(oneCol,'display','none');
		if(pointerScrub_var!==0){
			try{
				elRemover(psDiv);
			}catch(e){;}
			psDiv=null;
		}
		scrubEnt=false;
		last_psTime=[null,false,null];
		isOneCol=false;
		setStyle(document.documentElement,'min-height',doc_minHeight+'px');
		checkDur();
		tbG=true;
		gnrB.value='Generate thumbs';
		rsz_ifrm();
		}else{
		tbG=false;
		doThumbs();
		}
	}
		if(sndHide){
			chrome.runtime.sendMessage({type: 'expand',isVid:'true'}, function(response){});
		}
}




function doThumbs()
{
	
if (loadFlag===true){
	 done_t=t;
captions=[];
progresses=[];

	ttmp=0;
	thumbs.innerHTML =  '<section style="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;align-items: flex-end !important;"></section>';
	threeSct=thumbs.firstChild;
	if(vMut!==null){
		myVdo.pause();
		myVdo.muted =vMut; //set to og mute status
		vMut=null;
	}
	bsw=0;
	vidSeek=false;
	myVdo.currentTime = 0;

aseek=1;

if(!tTrkFlg){
	setStyle(bSect,'width','min-content');
	setStyle(bSect,'min-width','');
	setStyle(bSect,'max-width','');
	curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
	let bSectR=absBoundingClientRect(bSect);
	let bsrw=bSectR.width
	bsw=(bsrw>bsw)?bsrw:bsw;
	setStyle(bSect,'width',bsw+'px');
	setStyle(bSect,'min-width',bsw+'px');
	setStyle(bSect,'max-width',bsw+'px');
	ifrmRsz();
}

var tu2=(event) => {
	let chg=false;
	if(!tTrkFlg){
		setStyle(bSect,'width','min-content');
		setStyle(bSect,'min-width','');
		setStyle(bSect,'max-width','');
		curr.innerText= formatTime(myVdo.currentTime)+"\n("+myVdo.playbackRate.toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 7, useGrouping: false})+"x)";
		let bSectR=absBoundingClientRect(bSect);
		let bsrw=bSectR.width
		bsw=(bsrw>bsw)?bsrw:bsw;
		setStyle(bSect,'width',bsw+'px');
		setStyle(bSect,'min-width',bsw+'px');
		setStyle(bSect,'max-width',bsw+'px');
		ifrmRsz();
	}
 if(aseek==0){
	for(let i=0;i<captions.length;i++){
		let ci=captions[i];
		setStyle(ci,'display','inline-table');
		ci.innerText=ci.parentElement.parentElement.firstChild.attributes.timestamp_fmt.nodeValue;
		if(ci!==last_psTime[2]){
			setStyle(ci,'background-color',"#00000099");
		}
	}
	
		for(let i=0;i<progresses.length;i++){
			setStyle(progresses[i],'display','none');
		}
		figSize(null);
		
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
			setStyle(captions[nowFlag],'display',"none");
			setStyle(progresses[nowFlag],'display',"");
			figSize(progresses[nowFlag].parentElement.parentElement,chg,nowFlag);
			progresses[nowFlag].title=perc+"%";
			curr_thumb=nowFlag;
			setStyle(captions[nowFlag],'background-color',"#0004ff99");
			if(suppressTU===false){
				progresses[nowFlag].value=perc_r;
			}
			captions[nowFlag].parentElement.parentElement.onmousemove=function (e) {
			pgBar(nowFlag,progresses[nowFlag],e,attr,attr_next.timestamp.nodeValue);
			}
			nowFlag=-1;
			
	}else if (cap==cap_el){
			//captions[cap_el].innerText=attr.timestamp_fmt.nodeValue+" (NOW!)";
			setStyle(captions[cap_el],'display',"none");
			setStyle(progresses[cap_el],'display',"");
			figSize(progresses[cap_el].parentElement.parentElement,chg,cap_el);
			progresses[cap_el].title=perc+"%";
			curr_thumb=cap_el;
			setStyle(captions[cap_el],'background-color',"#0004ff99");
			if(suppressTU===false){
			progresses[cap_el].value=perc_r;
			}
			captions[cap_el].parentElement.parentElement.onmousemove=function (e) {
			pgBar(cap_el,progresses[cap_el],e,attr,attr_next.timestamp.nodeValue);
			}
	}else{
		var until=(cap_el<captions.length)?Math.max(0,attr_next.timestamp.nodeValue-myVdo.currentTime):Math.max(0,myVdo.duration-myVdo.currentTime);
		until=formatTime(until,1);
			captions[cap_el+1].innerText=attr_next.timestamp_fmt.nodeValue+" (NEXT) ["+until+"]";
			//captions[cap_el].innerText=attr.timestamp_fmt.nodeValue+" (LAST) ["+perc+"%]";
			setStyle(captions[cap_el],'display',"none");
			setStyle(progresses[cap_el],'display',"");
			figSize(progresses[cap_el].parentElement.parentElement,chg,cap_el);
			progresses[cap_el].title=perc+"%";
			curr_thumb=cap_el;
			setStyle(captions[cap_el],'background-color',"#006115c7");
			if(suppressTU===false){
			progresses[cap_el].value=perc_r;
			}
			captions[cap_el].parentElement.parentElement.onmousemove=function (e) {
			pgBar(cap_el,progresses[cap_el],e,attr,attr_next.timestamp.nodeValue);
			}
	}
}else{

	if(nowFlag>-1){
			//captions[nowFlag].innerText=attr_now.timestamp_fmt.nodeValue+" (NOW!)";
			setStyle(captions[nowFlag],'display',"none");
			setStyle(progresses[nowFlag],'display',"");
			figSize(progresses[nowFlag].parentElement.parentElement,chg,nowFlag);
			progresses[nowFlag].title=perc+"%";
			curr_thumb=nowFlag;
			setStyle(captions[nowFlag],'background-color',"#0004ff99");
			if(suppressTU===false){
					progresses[nowFlag].value=perc_r;
			}
			captions[nowFlag].parentElement.parentElement.onmousemove=function (e) {
			pgBar(nowFlag,progresses[nowFlag],e,attr,myVdo.duration);
			}
	}else if (cap==cap_el){
		if(cap_el>=captions.length){
			//captions[captions.length-1].innerText=attr.timestamp_fmt.nodeValue+" (LAST) ["+100+".0%]";
			setStyle(captions.at(-1),'display',"none");
			setStyle(progresses.at(-1),'display',"");
			figSize(progresses.at(-1).parentElement.parentElement,chg,progresses.length-1);
			progresses[captions.length-1].title="100.0%";
			curr_thumb=captions.length-1;
			setStyle(captions[captions.length-1],'background-color',"#006115c7");	
			if(suppressTU===false){
			progresses[captions.length-1].value=1;
			}
			captions[captions.length-1].parentElement.parentElement.onmousemove=function (e) {
			pgBar(captions.length-1,progresses[captions.length-1],e,attr,myVdo.duration);
			}
		}else{
		//captions[cap_el].innerText=attr.timestamp_fmt.nodeValue+" (NOW!)";
		setStyle(captions[cap_el],'display',"none");
		setStyle(progresses[cap_el],'display',"");
		figSize(progresses[cap_el].parentElement.parentElement,chg,cap_el);
		progresses[cap_el].title=perc+"%";
		curr_thumb=cap_el;
		setStyle(captions[cap_el],'background-color',"#0004ff99");
		if(suppressTU===false){
		progresses[cap_el].value=perc_r;
		}
			captions[cap_el].parentElement.parentElement.onmousemove=function (e) {
			pgBar(cap_el,progresses[cap_el],e,attr,myVdo.duration);
			}
		}
	}else{
			//captions[captions.length-1].innerText=attr.timestamp_fmt.nodeValue+" (LAST) ["+perc+"%]";
			setStyle(captions.at(-1),'display',"none");
			setStyle(progresses.at(-1),'display',"");
			figSize(progresses.at(-1).parentElement.parentElement,chg,progresses.length-1);
			progresses[captions.length-1].title=perc+"%";
			curr_thumb=captions.length-1;
			setStyle(captions[captions.length-1],'background-color',"#006115c7");
			if(suppressTU===false){
			progresses[captions.length-1].value=perc_r;
			}
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
		suppressTU=(suppressTU===true)?false:suppressTU;
});	

myVdo.addEventListener("playing", (event)=>{
	tu2(event);
});		

	function getMoving(){
		let p_n=performance.now();
		let df=p_n-t_b;
		if(df>mx){
			if(time_track[1]<1 || jBack===true){
				vMut=myVdo.muted;
				myVdo.muted = true;
				myVdo.play();
				jBack=(jBack===true)?false:jBack;
			}else{
				vidSeek=false;
				myVdo.currentTime=time_track[0];
				jBack=true;
			}
			t_a=p_n;
			t_b=p_n;
			mx=df;
		}
	}
	
	let gtmv = setInterval(getMoving, (Math.abs(mx)+1));
	
function endGtMv() {
  clearInterval(gtmv);
}
 
function thumbseek(bool){
	if(bool){
		if(!((ttmp==0)&&(myVdo.readyState<2))){
			t_a=performance.now();
			if(vMut!==null){
				myVdo.pause();
				myVdo.muted =vMut; //set to og mute status
				vMut=null;
			}else if(!myVdo.paused){
				myVdo.pause();
			}
			time_track =[ttmp*(myVdo.duration/t),ttmp];
			vhw.h=myVdo.videoHeight;
			vhw.w=myVdo.videoWidth;
			gnrB.value='Generating thumbs';
			generateThumbnail();
			ttmp++;
			if (ttmp<done_t) {
			t_b=performance.now();
			let tm=t_b-t_a;
			mx=(tm>mx)?tm:mx;
			tTrkFlg=true;
			setStyle(bSect,'width','min-content');
			setStyle(bSect,'min-width','');
			setStyle(bSect,'max-width','');
			curr.innerText= formatTime(myVdo.currentTime)+"\n"+ttmp+"/"+done_t;
			let bSectR=absBoundingClientRect(bSect);
			let bsrw=bSectR.width
			bsw=(bsrw>bsw)?bsrw:bsw;
			setStyle(bSect,'width',bsw+'px');
			setStyle(bSect,'min-width',bsw+'px');
			setStyle(bSect,'max-width',bsw+'px');
			ifrmRsz();
			if(ttmp===1){
				ifrm2.scrollIntoView({behavior: "instant", block: 'start', inline: "start"});
			}
			vidSeek=false;
			myVdo.currentTime = ttmp*(myVdo.duration/t);
			}else {
				endGtMv();
				aseek=0;
				gnrB.value='Generate thumbs';
				tTrkFlg=false;
				time_track=[-1,0];
				ttmp=0;
				bsw=0;
				vidSeek=false;
				myVdo.currentTime=0;
				//zeroRsz=true;
				setStyle(mvdb,'display','block');
				setStyle(oneCol,'display','block');
				if(pointerScrub_var!==0){
					psDiv=document.createElement('div');
					psDiv.style.cssText="all: initial !important; min-height: 9px !important; height: "+(pointerScrub_var*window.screen.height)+"px !important; display: none !important; position: absolute !important;  top: 0px !important;  left: 0px !important; transform-origin: top left !important; background: #00ffff99 !important; z-index: "+(Number.MAX_SAFE_INTEGER)+" !important;";
					psDiv.title="Hover over to scrub through thumbs";
					firstAncestor.insertAdjacentElement('afterend',psDiv);
				}
				shiftBtns(false);
				setStyle(scrl,'display','');
				setStyle(scrl1,'display','');
				rsz_ifrm();
				rsz();
				ifrm2.scrollIntoView({behavior: "instant", block: 'start', inline: "start"});

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
				
				oneCol.onclick=function(){
					isOneCol=!isOneCol;
					let scts=[...thumbs.children];
					if(isOneCol){
							let tw=thumbs.getBoundingClientRect().width;
							for(let i=0, len_i=scts.length; i<len_i; i++){
								let si=scts[i];
								let fgs=[...si.children];
								let ls=si;
								let fg0=fgs[0];
								setStyle(fg0,'height','');
								setStyle(fg0,'zoom',1);
								let sz=tw/(fg0.getBoundingClientRect().width*getFloat(fg0.style.zoom));
								setStyle(si,'zoom',sz);
							for(let j=1, len_j=fgs.length; j<len_j; j++){
								let fj=fgs[j];
								setStyle(fj,'height','');
								setStyle(fj,'zoom',1);
								let ns=document.createElement('section');
								ls.insertAdjacentElement('afterend',ns);
								ns.style.cssText=si.style.cssText;
								setStyle(ns,'zoom',tw/(fj.getBoundingClientRect().width*getFloat(fj.zoom)));
								ns.insertAdjacentElement('afterbegin',fj);
								ls=ns;
							}
						}
						if(psDiv!==null){
							setStyle(psDiv,'display','block');
							let currThumb=Math.floor((myVdo.currentTime/myVdo.duration)*done_t);
							let figSt=(currThumb/done_t)*100;
							let figEnd=((currThumb+1)/done_t)*100;
							setStyle(psDiv,'background',`linear-gradient(to right, #00ffff99 0%,#00ffff99 ${figSt}%,#ff000099 ${figSt}%,#ff000099 ${figEnd}%,#00ffff99 ${figEnd}%)`);
						}
					}else{
						let rem=[];
						let tw=thumbs.getBoundingClientRect().width;
						for(let i=0, len_i=scts.length; i<len_i; i+=3){
							let si=scts[i];
							let si1=scts[i+1];
							let si2=scts[i+2];
							rem.push(si1);
							rem.push(si2);
							let f1=si1.firstElementChild;
							setStyle(f1,'zoom',f1.getAttribute('three_sect_zoom'));
							si.insertAdjacentElement('beforeend',f1);
							let f2=si2.firstElementChild;
							setStyle(f2,'zoom',f2.getAttribute('three_sect_zoom'));
							si.insertAdjacentElement('beforeend',f2);
							setStyle(si,'zoom',1);
							setStyle(si,'zoom',tw/si.getBoundingClientRect().width);
						}
						for(let i=0, len_i=rem.length; i<len_i; i++){
							elRemover(rem[i]);
						}
						figSize(currentFig,true);
						//rsz();
						if(psDiv!==null){
							setStyle(psDiv,'display','none')
						}
					}
					
					let sh=thumbs.scrollHeight;
					
					setStyle(ifrm2,'min-height',sh+'px');
					setStyle(ifrm2,'height',sh+'px');
					setStyle(ifrm2,'max-height',sh+'px');
					let faRect=absBoundingClientRect(firstAncestor);
					
					doc_minHeight=Math.max(
						((doc_minHeight===null)?0:doc_minHeight),
						parseFloat(window.getComputedStyle(document.documentElement)['min-height']),
						absBoundingClientRect(ifrm2).bottom,
						absBoundingClientRect(ifrm3).bottom,
						faRect.bottom/( faRect.height / firstAncestor.offsetHeight)
					);
					setStyle(document.documentElement,'min-height',doc_minHeight+'px');
					chrome.runtime.sendMessage({doc_minHeight:doc_minHeight, url:window.location.href, type: 'size'}, function(response){;});
					scrollElMidPage(captions[curr_thumb].parentElement.parentElement,ifrm2);
					
				}
				
				mvdb.onclick=function(){
					vfr=!vfr;
					firstAncestor_wh={};
					if(vfr){
						let w1=window.getComputedStyle(firstAncestor);
						setFA_wh(w1,true);
					}
					doc_minHeight=(doc_minHeight===null)?parseFloat(window.getComputedStyle(document.documentElement)['min-height']):doc_minHeight;
					doc_minHeight=(doc_minHeight===null || isNaN(doc_minHeight))?0:doc_minHeight;
					setStyle(rlcRsz,'display',(vfr)?'block':'none');
					ifrmRsz();
					shb2=false;
					shiftBtns2(false);
					if(vfr){
						scrollElMidPage(captions[curr_thumb].parentElement.parentElement,ifrm2);
					}else{
						setStyle(document.documentElement,'min-height',doc_minHeight+'px');
						chrome.runtime.sendMessage({doc_minHeight:doc_minHeight, url:window.location.href, type: 'size'}, function(response){;});
					}
				};
									
					function wnd_wheel(event){
							if(!wndWh){
								wndWh=true;
								let sk=false;
								if( event.composedPath().includes(myVdo) ){
									sk=true;
								}else{
									let vr=absBoundingClientRect(myVdo);
									let esx=event.clientX+getScrollX();
									let esy=event.clientY+getScrollY();
									sk=(esx >= vr.left && esx <= vr.right && esy >= vr.top && esy <= vr.bottom && hasAncestor(myVdo,event.target) )?true:sk;
								}
								if(sk){
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
					
		function figSkipper(event){
			try{
						if(!figSk){
							figSk=true;							
							//if(event.composedPath().filter((p)=>{return p.tagName==='FIGURE';}).length>0){
								skip(event);						
								let t=captions[curr_thumb].parentElement.parentElement;
								suppressScr=true;
								//scrollElMidPage(t,ifrm2);
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

				if(oneCol_var===true){
					oneCol.click();
				}
				if(relocVid_var===true){
					mvdb.click();
				}
				if(spdDef_var===true){
					spb.click();
				}
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
	if((aseek==1)&&(myVdo.readyState>=2)){
		if(myVdo.currentTime>time_track[0]){
			thumbseek(true);
		}else{
			vidSeek=false;
			myVdo.currentTime=ttmp*(myVdo.duration/t);
		}
	}else{
		if(vidSeek===true){
			justSeek=true;
		}else{
			vidSeek=true;
		}
		thumbseek(false);
	}
}); 

myVdo.addEventListener("wating", (event) => {
myVdo.playbackRate=1;
	if((aseek==1)&&(myVdo.readyState>=2)){
		if(myVdo.currentTime>time_track[0]){
			thumbseek(true);
		}else{
			vidSeek=false;
			myVdo.currentTime=ttmp*(myVdo.duration/t);
		}
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

	if((aseek==1)&&(myVdo.readyState>=2)){
		if(myVdo.currentTime>time_track[0]){
			thumbseek(true);
		}else{
			vidSeek=false;
			myVdo.currentTime=ttmp*(myVdo.duration/t);
		}
	}else{
		if(vidSeek===true){
			justSeek=true;
		}else{
			vidSeek=true;
		}
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
setStyle(pgb,'display','none');
setStyle(pgb,'transform-origin','top');
setStyle(pgs,'display','contents');
setStyle(pgs,'width','inherit');
setStyle(pgs,'position','absolute');
var c = ifrm2.contentWindow.document.createElement("canvas");
setStyle(c,'align-self','end');

var ctx = c.getContext("2d");

let v_width = vhw.w;
let v_height = vhw.h;

c.width= v_width;
c.height=v_height;   

setStyle(f,'width',v_width);
setStyle(f,'height',v_height);



c.setAttribute('timestamp', myVdo.currentTime);
let format_time=formatTime(myVdo.currentTime);
c.setAttribute('timestamp_fmt', format_time);

ctx.drawImage(myVdo, 0, 0, v_width, v_height);

let ifw=getScreenWidth(false);

setStyle(ifrm2,'min-width',ifw+'px');
setStyle(ifrm2,'width',ifw+'px');
setStyle(ifrm2,'max-width',ifw+'px');


try{
	let fprc=absBoundingClientRect(firstParent);
	let vrc=absBoundingClientRect(myVdo);
	let ifR=absBoundingClientRect(ifrm);
	let btm=Math.max(fprc.bottom,vrc.bottom,ifR.bottom);
	if(parseFloat(ifrm2.style.top)<parseFloat(btm+gapVid)){
		let tp=btm+gapVid;
		setStyle(ifrm2,'top',tp+'px');
		setStyle(ifrm3,'top',tp+'px');
	}
}catch(e){
							
ancsRsz();
								
}


shiftBtns(true);

if (threeSct.children.length===3){
	threeSct=ifrm2.contentWindow.document.createElement("section");
	thumbs.appendChild(threeSct);
	threeSct.style.cssText="display: inline-flex !important; margin: 0px !important; border: 0px !important; padding: 0px !important;align-items: flex-end !important;";
}

threeSct.appendChild(f);

setStyle(f,'margin',0);
setStyle(f,'border',0);
setStyle(f,'padding',0);
f.setAttribute('three_sect_zoom',1);

f.appendChild(c);
f.appendChild(pgs);
ct.innerHTML=format_time;
pgs.appendChild(pgb);
pgs.appendChild(ct);
captions.push(ct);
progresses.push(pgb);
f.style.cssText="display: inline-grid !important; margin: 0 0 0 0 !important;";
ct.style.cssText+="color: white  !important; font-size: 169%  !important; display: inline-table !important; position: absolute !important; transform-origin: top left !important; font-family: Microsoft JhengHei UI !important";

let wcs_f=window.getComputedStyle(f);
setStyle(pgb,'width',wcs_f.width);
setStyle(pgb,'height',`${(parseFloat(wcs_f.height)*0.02)}px`);

if(threeSct.children.length>1){
	let ch3=[...threeSct.children];
	let w0=ch3[0].scrollWidth;
	let chSW=[w0];
	let wMax=w0;
	let brk=false;
	for (let k = 1; k < ch3.length; k++) {
		let ckw=ch3[k].scrollWidth;
		chSW.push(ckw);
		if(ckw!==w0){
			brk=true;
		}
		if(ckw>wMax){
			wMax=ckw;
		}
	}
	if(brk===true){
		for (let k = 0; k < ch3.length; k++) {
			let swk=chSW[k];
			if(swk!==wMax){
				let c3k=ch3[k];
				let z3=wMax/chSW[k];
				setStyle(c3k,'zoom',z3);
				c3k.setAttribute('three_sect_zoom',z3);
			}
		}
	}
}

rsz();

setStyle(ct,'zoom',(f.scrollWidth/ct.clientWidth)*0.2);

  f.onclick= function(e){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	  if(window.getComputedStyle(progresses[index]).display==='none'){
	nowFlag=index;
	cap=index;
	vidSeek=false;
	myVdo.currentTime =c.attributes.timestamp.nodeValue;
/*if(!myVdo.ownerDocument.pictureInPictureElement && !vfr){
			scrollElMidPage(myVdo);
}else{
	scrollElMidPage(this,ifrm2);
}*/
suppressScr=true;
	  }else{
			let t,cvs;
			if(e.target.tagName==='CANVAS'){
				cvs=e.target;
				t=cvs.parentElement;
			}else{ //FIGURE
				t=e.target;
				cvs=t.firstElementChild;
			} //t=figure
			let prg=t.lastElementChild.firstElementChild;
			index = progresses.indexOf(prg);
			nowFlag=index;
			cap=index;
			let cur=parseFloat(cvs.getAttribute('timestamp'));
			let rct=absBoundingClientRect(prg);
			let fz=t.style.zoom;
			let pfz=getFloat(fz);
			//let z=( isNaN(pfz) || isOneCol )?1:0.01*pfz;
			let fct=getFloat(t.parentElement.style.zoom);
			let pv=e.offsetX/(rct.width*fct*pfz) ;
			prg.value=pv;
			let nxt=(index===captions.length-1)?myVdo.duration:parseFloat(captions[index+1].parentElement.previousElementSibling.getAttribute('timestamp'));
			suppressTU=true;
			vidSeek=false;
			myVdo.currentTime=(1-pv)*cur+pv*nxt;
	  }
} 

 f.ondblclick=  function(e){
    var index = captions.indexOf(this.lastElementChild.lastElementChild);
	  if(window.getComputedStyle(progresses[index]).display!=='none'){
	nowFlag=index;
	cap=index;
	vidSeek=false;
	myVdo.currentTime =c.attributes.timestamp.nodeValue;
/*if(!myVdo.ownerDocument.pictureInPictureElement && vfr){
			scrollElMidPage(myVdo);
}else{
	scrollElMidPage(this,ifrm2);
}*/
suppressScr=true;
	  }
	  window.getSelection().removeAllRanges();
} 



}
  
}else{
alert('Video not loaded!');
}

}

}

setStyle(document.documentElement,'overflow','visible');
setStyle(document.body,'overflow','scroll');

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