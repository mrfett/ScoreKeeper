function MainAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

/* Timer Code *****************/

//setup Timer Button
MainAssistant.prototype.setupTimerButton = function() {
	this.buttonAttributes = {};
    this.timerButtonModel = {
        buttonClass : 'primary',
        disabled : false
        };

    this.controller.setupWidget("timerButton", this.buttonAttributes, this.timerButtonModel);
	Mojo.Event.listen(this.controller.get('timerButton'), Mojo.Event.tap, this.timerToggle.bind(this));
}

MainAssistant.prototype.stopAlert = function() {
	//this.showDialogBox("Testing", "Alert Function!")
	
	var msg = "Time is up!";
	Mojo.Controller.getAppController().showBanner({icon: "Img.png", messageText: msg, soundClass: "alerts"}, msg);
}

MainAssistant.prototype.updateTime = function() {
	var appController, bannerParams;
	this.totalSeconds--;
	if (this.totalSeconds <= 0) {
		this.stopTimer();
		this.stopAlert();
	}
	this.updateTimerText(this.formatTime(this.totalSeconds));
}

MainAssistant.prototype.stopTimer = function() {
	window.clearInterval(this.interval);
}

MainAssistant.prototype.formatTime = function(entered_seconds) {
	var hours, minutes, seconds, hours_text, minutes_text, seconds_text;
	hours = Math.floor(entered_seconds / 3600);
	minutes = Math.floor(entered_seconds / 60) % 60;
	seconds = entered_seconds % 60;
	hours_text = "0" + hours.toString();
	minutes_text = "0" + minutes.toString();
	seconds_text = "0" + seconds.toString();
	hour_text = hours_text.substring(hours_text.length - 2);
	if (hours_text == "00") {
		hours_text = "";
	} else {
		hours_text += " :";
	}
	if ((minutes >= 10) && (hours == 0)) {
		minutes_text = minutes_text.substring(minutes_text.length - 2);
	} else {
		minutes_text = minutes_text.substring(minutes_text.length - 1);
	}
	seconds_text = seconds_text.substring(seconds_text.length - 2);
	return hours_text + minutes_text + ":" + seconds_text;
}

// Start the Timer
MainAssistant.prototype.timerToggle = function(event) {
	if (this.timerRunning == 0) {
		//this.showDialogBox("Button Test", "Starting Timer");
		this.timerRunning = 1;
		this.interval = window.setInterval(this.updateTimeHandler, 1000);
	} else {
		//this.showDialogBox("test", "Attempting stop function");
		this.stopTimer();
		this.timerRunning = 0;
	}
	//Mojo.Event.listen(this.controller.get('timerButton'), Mojo.Event.tap, this.timerStop.bind(this));
}

// Stop the Timer
MainAssistant.prototype.timerStop = function() {
	//this.showDialogBox('FunctionTest', 'timerStop function triggered.');
	this.interval = window.clearInterval(this.updateTime);
	Mojo.Event.listen(this.controller.get('timerButton'), Mojo.Event.tap, this.timerToggle.bind(this));
}

// Update the time
MainAssistant.prototype.updateTimerText = function(text) {
	$("timerButton").innerHTML = text.toString();
}

// Dialog
MainAssistant.prototype.showDialogBox = function(title,message){
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}


/* End Timer Code ************/

// Increment the left score when pressed
MainAssistant.prototype.handleLeftScoreButtonPress = function(event) {
	this.leftScore++;
    this.controller.get('leftScore').update(this.leftScore);
}

// Increment the right score when pressed
MainAssistant.prototype.handleRightScoreButtonPress = function(event) {
	this.rightScore++;
    this.controller.get('rightScore').update(this.rightScore);
}

MainAssistant.prototype.handleScoreSettingsButtonPress = function(event) {
	this.controller.showDialog({
			template: 'main/score-settings',
			assistant: new MydialogAssistant(this, this.callback.bind(this)),
			preventCancel: true
		});
}

MainAssistant.prototype.setupLeftScore = function() {
	// set the initial left total and display it
    this.leftScore=0;
    this.controller.get('leftScore').update(this.leftScore);
		
	// a local object for the left score button model
    this.leftScoreButtonModel = {
        buttonClass : 'primary',
        disabled : false
        };
		
	this.controller.setupWidget("leftScore", this.buttonAttributes, this.leftScoreButtonModel);
	
	Mojo.Event.listen(this.controller.get('leftScore'), Mojo.Event.tap, this.handleLeftScoreButtonPress.bind(this));	
}

MainAssistant.prototype.setupRightScore = function() {
	// set the initial right total and display it
    this.rightScore=0;
    this.controller.get('rightScore').update(this.rightScore);
	
	// a local object for the left score button model
    this.rightScoreButtonModel = {
        buttonClass : 'primary',
        disabled : false
        };
		
	this.controller.setupWidget("rightScore", this.buttonAttributes, this.rightScoreButtonModel);
	
	Mojo.Event.listen(this.controller.get('rightScore'), Mojo.Event.tap, this.handleRightScoreButtonPress.bind(this));	
}

MainAssistant.prototype.setupScoreSettings = function(event) {
	this.scoreSettingsButtonModel = {
        buttonClass : 'secondary',
        disabled : false
        };
		
	this.controller.setupWidget("scoreSettings", this.buttonAttributes, this.scoreSettingsButtonModel);
	Mojo.Event.listen(this.controller.get('scoreSettings'), Mojo.Event.tap, this.handleScoreSettingsButtonPress.bind(this));
}

MainAssistant.prototype.setup = function() {
	// Set up the left Score Button functionality
	this.setupLeftScore();
	
	// Set up the right Score Button functionality
	this.setupRightScore();
	
	//Setup the score settings button
	this.setupScoreSettings();
	
	// Set up the timer
	this.setupTimerButton();
	this.totalSeconds = 180;
	this.timerRunning = 0;
	this.updateTimerText(this.formatTime(this.totalSeconds));
	this.updateTimeHandler = this.updateTime.bind(this);
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
