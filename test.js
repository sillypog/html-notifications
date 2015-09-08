$(function(){
	notifications.init();

	var permissionRequested = false;
	checkNotificationStatus();

	function checkNotificationStatus(){
		switch (notifications.status()){
			case notifications.options.UNSUPPORTED:
				$("#no-support").removeClass("hidden");
				break;
			case notifications.options.NO_PERMISSION:
				if (permissionRequested) {
					$("#no-permission").removeClass("hidden");
				} else {
					$("#request-permission").removeClass("hidden").click(function(){
						permissionRequested = true;
						$(this).addClass("hidden")
						notifications.requestPermission(checkNotificationStatus);
					});
				}
				break;
			case notifications.options.READY:
					$("#create-notification").removeClass("hidden").find(":submit").click(postNotification);
				break;

		}
	}

	function postNotification(e){
		console.log("Submit clicked");
		e.preventDefault();

		var image = "logo.png",
		    title = $("#notification-title")[0].value;
		    content = $("#notification-body")[0].value;
		notifications.post(image, title, content, notificationClick);
	}

	function notificationClick(){
		window.open(content, "_blank");
	}
});
