


var retest_time = 5000; //the server is tested every retest_time milliseconds (every retest_time/1000 seconds)
var speakspeed = 500; //taling speed (for error codes), the lower the number the faster the talking

var test_url = url_base + "xmltest.xml"; //version that tests only web server, not DB
if(test_DB==1)
{test_url = url_base + "xmltest.php";} //version that tests both web server and DB!

var volumes = new Array();
volumes['good'] = null;
volumes['bad'] = null;
volumes['other'] = null;
function get_volumes(){

	for (let key in volumes) {
		if (volumes.hasOwnProperty(key)) {
			//console.log(key, volumes[key]);
			let vol_id = 'vol_' + key;
			//console.log('vol_id',vol_id);
			let input = document.getElementById(vol_id);
			let value = input.value;
			volumes[key] = value;
		}
	}
}
get_volumes();

$( ".vol" ).change(function() {
	let prefix_to_remove = 'id_';
	let vol_name = this.id.substr(prefix_to_remove.length+1);
	//console.log('vol_name',vol_name);
	volumes[vol_name] = this.value;
});

var audios = {}
function makesound(elsound)
{
	// var myFlashMovie = document.simpleBroadcaster;
	// myFlashMovie.playsound_js(elsound);

	//console.log('elsound',elsound);
	let prefix_to_remove = 'sound_';
	let sound_name = elsound.substr(prefix_to_remove.length);
	let sound_volume = volumes['other'];
	//console.log('sound_name',sound_name);
	let sound_has_volume = volumes.hasOwnProperty(sound_name);
	//console.log('sound_has_volume',sound_has_volume);
	if(sound_has_volume){
		sound_volume = volumes[sound_name];
	}
	//console.log('sound_volume',sound_volume);

	let prefix_to_add = url_base + 'sounds/';
	let suffix_to_add = '.mp3';
	let sound_file_name = prefix_to_add + sound_name + suffix_to_add;
	//console.log('playing file',sound_file_name);

	let audio;
	if(Object.hasOwn(audios,sound_file_name)){
		//console.log('audios array already containing this sound, reusing',audios);
		audio = audios[sound_file_name];
	}else{
		//console.log('audios array did not already contain this sound, creating new audio',audios);
		audio = new Audio(sound_file_name);
		audios[sound_file_name] = audio;
	}

	audio.volume = sound_volume;
	audio.play();
}


var t=setTimeout("test()",retest_time);


var safety;
var safety_time = 120000;
function timedout()
{
	makesound('sound_serveur');                
	var gab1=setTimeout("makesound('sound_1');",speakspeed);
	var gab2=setTimeout("makesound('sound_timeout');",speakspeed*2);
	clearTimeout(t);
	t=setTimeout("test()",retest_time);
}


function test()
{
	loadpage();
	clearTimeout(safety);
	safety=setTimeout("timedout()",safety_time);
}





function loadpage()
{
	var ts = Math.round((new Date()).getTime() / 1000);
	var useurl = test_url+"?ts=" + ts + "&rand=" + Math.random();
	//window.open(useurl);
	loadXMLDoc3(useurl);
}

var req3;
function loadXMLDoc3(url) 
{
	if (window.XMLHttpRequest)
	{
		// branch for native XMLHttpRequest object
		req3 = new XMLHttpRequest();
		req3.onreadystatechange = processReqChange3;
		req3.open("GET", url, true);
		req3.send(null);
	}
	else if (window.ActiveXObject)
	{
		// branch for IE/Windows ActiveX version
		req3 = new ActiveXObject("Microsoft.XMLHTTP");
		if (req3)
		{
			req3.onreadystatechange = processReqChange3;
			req3.open("GET", url, true);
			req3.send();
		}
	}
}

var countbadsinarow = 0;

// Congestion event tracking
var wasCongested = false;
var congestionPollCount = 0;
var currentEventIndex = -1;
var congestionEvents = [];
var STORAGE_KEY = 'chipmunk_events';
var MAX_EVENTS = 50;
var SNAPSHOT_SCHEDULE = [0, 6, 12, 24, 60, 120, 240, 360];
var SNAPSHOT_RECURRING = 360;
function processReqChange3() 
{
	if (req3.readyState == 4)
	{
		if (req3.status == 200)
		{
			response = req3.responseXML.documentElement;
            var result = response.getElementsByTagName("result")[0].firstChild.data;
            var howmanyinprocesslist = response.getElementsByTagName("howmanyinprocesslist")[0].firstChild.data;
            if(result == "ok")
			{
				//all is good! happy chipmunk!!
				countbadsinarow = 0;
				makesound('sound_good');
				
				if(max_items_in_processlist!=0 && howmanyinprocesslist>max_items_in_processlist)
				{
					//good but accumulation in the DB

					// Congestion event capture
					if (!wasCongested) {
						// New congestion episode
						wasCongested = true;
						congestionPollCount = 0;
						var plData = parseProcessList(response);
						var snap = createSnapshot(howmanyinprocesslist, plData);
						var eventObj = {
							startTime: snap.timestamp,
							endTime: null,
							peakCount: parseInt(howmanyinprocesslist),
							snapshots: [snap]
						};
						congestionEvents.push(eventObj);
						if (congestionEvents.length > MAX_EVENTS) {
							congestionEvents = congestionEvents.slice(congestionEvents.length - MAX_EVENTS);
						}
						currentEventIndex = congestionEvents.length - 1;
						saveEventsToStorage();
						renderCongestionEvents();
					} else {
						// Ongoing congestion - check if snapshot is due
						congestionPollCount++;
						var cnt = parseInt(howmanyinprocesslist);
						if (cnt > congestionEvents[currentEventIndex].peakCount) {
							congestionEvents[currentEventIndex].peakCount = cnt;
						}
						if (shouldTakeSnapshot(congestionPollCount)) {
							var plData = parseProcessList(response);
							var snap = createSnapshot(howmanyinprocesslist, plData);
							congestionEvents[currentEventIndex].snapshots.push(snap);
							saveEventsToStorage();
							renderCongestionEvents();
						}
					}

					var gab1=setTimeout("makesound('sound_serveur');",speakspeed);
					var gab1=setTimeout("makesound('sound_"+server_number+"');",speakspeed*2);
					var gab1=setTimeout("makesound('sound_database');",speakspeed*2.7);
					var gab1=setTimeout("makesound('sound_processlist');",speakspeed*4);
					
					//say the number of items in DB!!
					if(howmanyinprocesslist<10)
					{
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(0,1)+"');",speakspeed*6);
						var gab1=setTimeout("makesound('sound_items');",speakspeed*7);
					}
					else if(howmanyinprocesslist<100)
					{
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(0,1)+"');",speakspeed*6);
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(1,1)+"');",speakspeed*7);
						var gab1=setTimeout("makesound('sound_items');",speakspeed*8);
					}
					else if(howmanyinprocesslist<1000)
					{
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(0,1)+"');",speakspeed*6);
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(1,1)+"');",speakspeed*7);
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(2,1)+"');",speakspeed*8);
						var gab1=setTimeout("makesound('sound_items');",speakspeed*9);
					}
					else
					{
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(0,1)+"');",speakspeed*6);
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(1,1)+"');",speakspeed*7);
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(2,1)+"');",speakspeed*8);
						var gab1=setTimeout("makesound('sound_"+howmanyinprocesslist.substr(3,1)+"');",speakspeed*9);
						var gab1=setTimeout("makesound('sound_items');",speakspeed*10);
					}
					
					

				}
				else
				{
					// Count is below threshold
					if (wasCongested) {
						// Congestion just ended - capture final resolution snapshot
						var snap = createSnapshot(howmanyinprocesslist, []);
						congestionEvents[currentEventIndex].snapshots.push(snap);
						congestionEvents[currentEventIndex].endTime = snap.timestamp;
						saveEventsToStorage();
						renderCongestionEvents();
						wasCongested = false;
						congestionPollCount = 0;
						currentEventIndex = -1;
					}
				}
			}
			else if(result == "DB error")
			{
				//web server up but DB down! (or temporarily paralysed by congestion)
				
				countbadsinarow++;
				
				if(countbadsinarow>=alarm_after_how_many_bad_connections)
				{makesound('sound_bad');}
				
				var gab1=setTimeout("makesound('sound_serveur');",speakspeed);
				var gab1=setTimeout("makesound('sound_"+server_number+"');",speakspeed*2);
				var gab1=setTimeout("makesound('sound_database');",speakspeed*2.7);
				var gab1=setTimeout("makesound('sound_down');",speakspeed*4);
			}
		}
		else
		{
			//web server down!!
			
			countbadsinarow++;
		
			var codeinstring = req3.status.toString();   
		
			if(countbadsinarow>=3)
			{makesound('sound_bad');}
	
			document.getElementById("problogs").innerHTML = document.getElementById("problogs").innerHTML + "status:" + req3.status + " ";
		
			var gab1=setTimeout("makesound('sound_serveur');",speakspeed);
			var gab1=setTimeout("makesound('sound_"+server_number+"');",speakspeed*2);
			var gab1=setTimeout("makesound('sound_code');",speakspeed*3);
						 
			var splodedcode = codeinstring.split("");
			var temposs = speakspeed*4;
			var gab333=new Array();
			for(x in splodedcode)
			{                       
				var dostring="makesound('sound_"+ splodedcode[x] +"');";
				gab333[temposs]=setTimeout(dostring,temposs);
				temposs=temposs+speakspeed;
			}
		
		
		}
	
	
	
		
		
		t=setTimeout("test()",retest_time);
	}
}


// --- Congestion event functions ---

function shouldTakeSnapshot(pollCount) {
	for (var i = 0; i < SNAPSHOT_SCHEDULE.length; i++) {
		if (pollCount === SNAPSHOT_SCHEDULE[i]) return true;
	}
	if (pollCount > SNAPSHOT_SCHEDULE[SNAPSHOT_SCHEDULE.length - 1]) {
		return (pollCount - SNAPSHOT_SCHEDULE[SNAPSHOT_SCHEDULE.length - 1]) % SNAPSHOT_RECURRING === 0;
	}
	return false;
}

function getXmlText(parentNode, tagName) {
	var nodes = parentNode.getElementsByTagName(tagName);
	if (nodes.length > 0 && nodes[0].firstChild) {
		return nodes[0].firstChild.data;
	}
	return '';
}

function parseProcessList(xmlResponse) {
	var data = [];
	var processNodes = xmlResponse.getElementsByTagName("process");
	for (var i = 0; i < processNodes.length; i++) {
		var proc = processNodes[i];
		data.push({
			id:      getXmlText(proc, "pid"),
			user:    getXmlText(proc, "user"),
			host:    getXmlText(proc, "host"),
			db:      getXmlText(proc, "db"),
			command: getXmlText(proc, "command"),
			time:    getXmlText(proc, "time"),
			state:   getXmlText(proc, "state"),
			info:    getXmlText(proc, "info")
		});
	}
	return data;
}

function createSnapshot(connectionCount, processlistData) {
	return {
		timestamp: new Date().toISOString(),
		connectionCount: parseInt(connectionCount),
		processlist: processlistData
	};
}

function loadEventsFromStorage() {
	try {
		var stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			congestionEvents = JSON.parse(stored);
			// Close any event left open from a previous session
			for (var i = 0; i < congestionEvents.length; i++) {
				if (!congestionEvents[i].endTime && congestionEvents[i].snapshots.length > 0) {
					congestionEvents[i].endTime = congestionEvents[i].snapshots[congestionEvents[i].snapshots.length - 1].timestamp;
				}
			}
		}
	} catch(e) {
		congestionEvents = [];
	}
}

function saveEventsToStorage() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(congestionEvents));
	} catch(e) {
		if (e.name === 'QuotaExceededError' || e.code === 22) {
			congestionEvents = congestionEvents.slice(Math.floor(congestionEvents.length / 2));
			try { localStorage.setItem(STORAGE_KEY, JSON.stringify(congestionEvents)); } catch(e2) {}
		}
	}
}

function pad2(n) {
	return n < 10 ? '0' + n : '' + n;
}

function formatTime(isoStr) {
	var dt = new Date(isoStr);
	return dt.getFullYear() + '-' + pad2(dt.getMonth()+1) + '-' + pad2(dt.getDate()) + ' ' + pad2(dt.getHours()) + ':' + pad2(dt.getMinutes()) + ':' + pad2(dt.getSeconds());
}

function escapeHtml(str) {
	if (!str) return '';
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderCongestionEvents() {
	var container = document.getElementById('congestionevents');
	if (!container) return;

	if (congestionEvents.length === 0) {
		container.innerHTML = '<p class="congestion-none">No congestion events recorded.</p>';
		return;
	}

	var html = '';
	for (var i = congestionEvents.length - 1; i >= 0; i--) {
		var evt = congestionEvents[i];
		var timeLabel = formatTime(evt.startTime);
		if (evt.endTime) {
			timeLabel += ' &rarr; ' + formatTime(evt.endTime);
		} else {
			timeLabel += ' <span class="congestion-ongoing">ongoing</span>';
		}

		html += '<div class="congestion-event">';
		html += '<div class="congestion-event-header" onclick="toggleEvent(' + i + ')">';
		html += '<span class="congestion-event-time">' + timeLabel + '</span>';
		html += ' &mdash; <span class="congestion-event-count">peak: ' + evt.peakCount + '</span>';
		html += ' <span class="congestion-event-snapshots">(' + evt.snapshots.length + ' snapshot' + (evt.snapshots.length !== 1 ? 's' : '') + ')</span>';
		html += ' <button class="congestion-csv-btn" onclick="event.stopPropagation(); downloadCSV(' + i + ')">CSV</button>';
		html += '</div>';
		html += '<div class="congestion-snapshots-container" id="event_' + i + '" style="display:none;">';

		for (var s = 0; s < evt.snapshots.length; s++) {
			var snap = evt.snapshots[s];
			html += '<div class="congestion-snapshot">';
			html += '<div class="congestion-snapshot-header" onclick="event.stopPropagation(); toggleSnapshot(' + i + ',' + s + ')">';
			html += formatTime(snap.timestamp) + ' &mdash; <span class="congestion-snapshot-count">' + snap.connectionCount + ' connections</span>';
			if (snap.processlist.length > 0) {
				html += ' (' + snap.processlist.length + ' processes)';
			}
			html += '</div>';
			html += '<div class="congestion-event-detail" id="snap_' + i + '_' + s + '" style="display:none;">';

			if (snap.processlist.length > 0) {
				html += '<table class="congestion-table">';
				html += '<thead><tr><th>ID</th><th>User</th><th>Host</th><th>DB</th><th>Cmd</th><th>Time</th><th>State</th><th>Info</th></tr></thead>';
				html += '<tbody>';
				for (var j = 0; j < snap.processlist.length; j++) {
					var p = snap.processlist[j];
					html += '<tr>';
					html += '<td>' + escapeHtml(p.id) + '</td>';
					html += '<td>' + escapeHtml(p.user) + '</td>';
					html += '<td>' + escapeHtml(p.host) + '</td>';
					html += '<td>' + escapeHtml(p.db) + '</td>';
					html += '<td>' + escapeHtml(p.command) + '</td>';
					html += '<td>' + escapeHtml(p.time) + '</td>';
					html += '<td>' + escapeHtml(p.state) + '</td>';
					html += '<td class="congestion-info-cell">' + escapeHtml(p.info) + '</td>';
					html += '</tr>';
				}
				html += '</tbody></table>';
			} else {
				html += '<p class="congestion-none">Resolution snapshot (count dropped below threshold)</p>';
			}

			html += '</div></div>';
		}

		html += '</div></div>';
	}

	container.innerHTML = html;
}

function toggleEvent(index) {
	var el = document.getElementById('event_' + index);
	if (el) el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

function toggleSnapshot(eventIndex, snapIndex) {
	var el = document.getElementById('snap_' + eventIndex + '_' + snapIndex);
	if (el) el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

function csvEscape(val) {
	if (val === null || val === undefined) return '""';
	var str = '' + val;
	if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1 || str.indexOf('\r') !== -1) {
		return '"' + str.replace(/"/g, '""') + '"';
	}
	return str;
}

function downloadCSV(eventIndex) {
	var evt = congestionEvents[eventIndex];
	if (!evt) return;

	var csvRows = ['Snapshot,Timestamp,ID,User,Host,DB,Command,Time,State,Info'];

	for (var s = 0; s < evt.snapshots.length; s++) {
		var snap = evt.snapshots[s];
		if (snap.processlist.length > 0) {
			for (var j = 0; j < snap.processlist.length; j++) {
				var p = snap.processlist[j];
				csvRows.push(
					csvEscape(s + 1) + ',' +
					csvEscape(snap.timestamp) + ',' +
					csvEscape(p.id) + ',' +
					csvEscape(p.user) + ',' +
					csvEscape(p.host) + ',' +
					csvEscape(p.db) + ',' +
					csvEscape(p.command) + ',' +
					csvEscape(p.time) + ',' +
					csvEscape(p.state) + ',' +
					csvEscape(p.info)
				);
			}
		} else {
			csvRows.push(csvEscape(s + 1) + ',' + csvEscape(snap.timestamp) + ',' + csvEscape(snap.connectionCount) + ',,,,,,,resolution');
		}
	}

	var blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
	var url = URL.createObjectURL(blob);
	var dt = new Date(evt.startTime);
	var filename = 'congestion_' + dt.getFullYear() + '-' + pad2(dt.getMonth()+1) + '-' + pad2(dt.getDate()) + '_' + pad2(dt.getHours()) + '-' + pad2(dt.getMinutes()) + '.csv';

	var link = document.createElement('a');
	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.display = 'none';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

function clearCongestionEvents() {
	if (confirm('Clear all stored congestion events?')) {
		congestionEvents = [];
		saveEventsToStorage();
		renderCongestionEvents();
	}
}

// Initialize congestion events from localStorage
loadEventsFromStorage();
renderCongestionEvents();
