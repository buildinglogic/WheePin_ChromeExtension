

document.addEventListener('DOMContentLoaded', function() {
	
	document.getElementById("displayBtn").onclick = function() {displayAllFunct()};

	function displayAllFunct() {
		var urlToSend = "displayAll.html";
		chrome.tabs.create({active: true, url: urlToSend});
	}

});	


