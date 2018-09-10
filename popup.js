
document.addEventListener('DOMContentLoaded', function() {

	// document.getElementById("links").onclick = function() {
	// 	chrome.tabs.query(function(tab) {
	// 		chrome.tabs.update(tab.id);
	// 	});
		
	// }

	findOrCreateWheePin(displayWheePin);


});	


function displayWheePin(wpFolderId) {
	var tagListInPopName = "MainList";
	displayTags(wpFolderId, tagListInPopName);
}

function findOrCreateWheePin(callback) {
	chrome.bookmarks.getChildren("0", function(children) {
		var bookmakrBarId = "";
		for(var i = 0; i < children.length; i++) {
			if(children[i].title == "Bookmarks Bar") {
				bookmakrBarId += children[i].id;
				break;
			}
		}

		var existedFolder = false;
		if(bookmakrBarId != "") {
			chrome.bookmarks.getChildren(bookmakrBarId, function(bkchildren) {
				var wpFolderId = "";
				for(var j = 0; j < bkchildren.length; j++) {
					if(bkchildren[j].title == "WheePin") {
						existedFolder = true;
						wpFolderId += bkchildren[j].id;
						callback(wpFolderId);
						break;
					}
				}

				if(!existedFolder) {
					var wpNode = new node("WheePin", null);
					createPageOrFolder(wpNode, bookmakrBarId, callback);
				}

			});
		}
		
	});
}

function displayTags(folderId, tagListInPopName) {

	chrome.bookmarks.getSubTree(folderId, function(curtTagNode) {
		var skipLink = document.getElementById("links").checked;
		if(!skipLink && curtTagNode[0].url) return; 
		console.log(curtTagNode);
		var tagList = document.getElementById(tagListInPopName);
		var newList= document.createElement("li");
		var newItem = document.createElement("a");
		var newItemName = document.createTextNode(curtTagNode[0].title); 
		newItem.appendChild(newItemName);

		newItem.onclick = function() {
			chrome.tabs.query( { currentWindow: true, active: true },
        			function (tabArray) { 
        				console.log(tabArray);
        				var newTab = new node(tabArray[0].title, tabArray[0].url);
        				createPageOrFolder(newTab, folderId, doNothing);
        			}
    			);
		}

		newList.appendChild(newItem);
		tagList.appendChild(newList);

		if(curtTagNode[0].children) {
			var newUL = document.createElement("ul");
			var newListID = curtTagNode[0].title + curtTagNode[0].id;
			newUL.setAttribute("id", newListID);
			tagList.appendChild(newUL);
			for(var i = 0; i < curtTagNode[0].children.length; i++) {
				displayTags(curtTagNode[0].children[i].id, newListID);
			}
		}
	});	
}

function createPageOrFolder(node, parentId, callback) {
	chrome.bookmarks.getSubTree(parentId, function(parentBKNode) {
		if(!parentBKNode || parentBKNode[0].url) {
			console.log("can't add link to link or parentFolder not existed, please create a new folder");
			return;
		}
		chrome.bookmarks.create({'parentId': parentId,
                             'title': node.title,
                             'url': node.url},
                            function(newPageOrFolder) {
                                writeLogMessage(newPageOrFolder, parentId);
                                callback(newPageOrFolder.id);
                            });
	});
}

function node(title, url, nodes=[]) {
    this.id = "-1";
    this.title = title;
    this.url = url;
    this.isFolder = (url == null);
    this.nodes = nodes;
}

function writeLogMessage(node, parentId) {
    console.log("Added page or folder '" + node.title + "' (" + node.id +
                ") to parent folder id " + parentId + ".");
}

function doNothing() {
	return;
}




