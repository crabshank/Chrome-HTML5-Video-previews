  var plRate_var= document.getElementById('plRate');
  var  everyX_var= document.getElementById('everyX');
  
  var  relocScale_var= document.getElementById('relocScale');
  var  oneCol_var= document.getElementById('oneCol');
  var  relocVid_var= document.getElementById('relocVid');
  var  pipDef_var= document.getElementById('pipDef');
  var spdDef_var= document.getElementById('spdDef');
  var svbt= document.getElementById('save');

function unDef(v,d,r){
	if(typeof r==='undefined'){
		return (typeof v !=='undefined')?v:d;
	}else{
		return (typeof v !=='undefined')?r:d;
	}
}

var saver =function(){
	 	plRate_var.value=(plRate_var.valueAsNumber>=1 && plRate_var.valueAsNumber<=16)?plRate_var.value:"6";
		everyX_var.value=(everyX_var.valueAsNumber>=1)?everyX_var.value:"30";
		
		
			chrome.storage.sync.clear(function() {
		chrome.storage.sync.set(
		{
			plRate_sett: plRate_var.value,
			everyX_sett: everyX_var.value,
			relocScale_sett: relocScale_var.innerText.trim(),
			oneCol_sett: oneCol_var.checked,
			relocVid_sett: relocVid_var.checked,
			spdDef_sett: spdDef_var.checked
		}, function()
		{
			let status = document.getElementById('stats');
			status.innerText = 'Options saved.';
			setTimeout(function()
			{
				status.innerText = '';
			}, 1250);
		});
			});
			

	 }
 
function restore_options()
{
	if(typeof chrome.storage==='undefined'){
		restore_options();
	}else{
	chrome.storage.sync.get(null, function(items)
	{
		if (Object.keys(items).length != 0)
		{
			//console.log(items);
			plRate_var.value = unDef(items.plRate_sett,"6");
			everyX_var.value = unDef(items.everyX_sett,"30");

			relocScale_var.innerText = unDef(items.relocScale_sett,"0.65");
			oneCol_var.checked = unDef(items.oneCol_sett,false);
			relocVid_var.checked = unDef(items.relocVid_sett,false);
			spdDef_var.checked = unDef(items.spdDef_sett,false);

			svbt.onclick = () => saver();
		}
		else
		{
			save_options();
		}
	});
	}
}

function save_options()
{
		chrome.storage.sync.clear(function() {
	chrome.storage.sync.set(
	{	
			plRate_sett: "6",
			everyX_sett: "30",
			relocScale_sett: "0.65",
			oneCol_sett: false,
			relocVid_sett: false,
			spdDef_sett: false
	}, function(){
		restore_options();
	});
		});
}

restore_options();