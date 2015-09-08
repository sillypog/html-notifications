notifications = (function(){

	var adapter;

	var status;
	var statusOptions = {UNSUPPORTED:'UNSUPPORTED', NO_PERMISSION:'NO_PERMISSION', READY:'READY'}

	function init(){
		var support = checkSupport();
		if (!support){
			status = statusOptions.UNSUPPORTED;
		} else {
			adapter = createAdapter(support);

			if (!adapter){
				status = statusOptions.UNSUPPORTED;
			} else if (adapter.checkPermission() == "granted"){
				// Permission already allowed
				status = statusOptions.READY;
			} else {
				// Can't request permission directly, need to respond to user event
				status = statusOptions.NO_PERMISSION;
			}
		}
	}

	function getStatus(){
		return status;
	}

	function requestPermission(externalCallback){
		adapter.requestPermission(function(){
			checkPermission();
			externalCallback();
		})
	}

	function postNotification(image, title, content, callback){
		if (adapter.checkPermission() == "granted") {
			console.log("Attempting to post");
			adapter.createNotification(image, title, content, callback);
		} else {
			status = statusOptions.NO_PERMISSION;
		}
	}

	/*************
	* Private
	*************/

	function createAdapter(type){
		var adapter;
		switch(type){
			case 'firefox': adapter = new FirefoxAdapter();
				break;
			case 'webkit': adapter = new WebkitAdapter();
				break;
			default: console.log('No adapter exists for', type);
		}
		return adapter;
	}


	function checkSupport(){
		var support;
		if (window.webkitNotifications){
			support = "webkit";
		} else if (window.Notification){
			support = "firefox";
		}
		return support;
	}

	function checkPermission(){
		switch(adapter.checkPermission()){
			case "granted":
				console.log('Permission granted');
				status = statusOptions.READY;
				break;
			default:
				status = statusOptions.NO_PERMISSION;
		}
	}

	/*************
	* Adapters
	*************/
	var FirefoxAdapter = function FirefoxAdapter(){
		console.log('new FirefoxAdapter');
		name = "FirefoxAdapter";
	}

	FirefoxAdapter.prototype.requestPermission = function(callback){
		Notification.requestPermission(callback);
	}

	FirefoxAdapter.prototype.checkPermission = function(){
		return Notification.permission;
	}

	FirefoxAdapter.prototype.createNotification = function(image, title, content, callback){
		var notification = new Notification(title, {
		    dir: "auto",
		    lang: "",
		    body: content,
		    tag: content,
		    icon: image
		});
		notification.onclick = callback;
	}

	/////////

	var WebkitAdapter = function WebkitAdapter(){
		console.log('new WebkitAdapter');
		name = "WebkitAdapter";
	}

	WebkitAdapter.prototype.requestPermission = function(callback){
		console.log(name, "requesting permission");
		window.webkitNotifications.requestPermission(callback);
	}

	WebkitAdapter.prototype.checkPermission = function(){
		var statusNames = ["granted", "default", "denied"];
		return statusNames[window.webkitNotifications.checkPermission()];
	}

	WebkitAdapter.prototype.createNotification = function(image, title, content, callback){
		var notification = window.webkitNotifications.createNotification(image, title, content);
		notification.tag = content;
		notification.onclick = callback;
		notification.show();
	}

	/***************
	* Export
	***************/
	return {
		init: init,
		options: statusOptions,
		status: getStatus,
		requestPermission: requestPermission,
		post: postNotification
	};

})();
