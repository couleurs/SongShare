
//load iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//figure out what the device is
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var ytVideoId;
var listeningroom_id;
var fetchVideoId;
var chatinput;
var chatroom;
var username;

var socket;

//setup functions
var onIframeReady;
var onDocumentReady;
var secondConnection = false;
var documentReady = false;

$( document ).ready(function() {
	ytVideoId = $('#player').data('videoid');
	listeningroom_id = $('#player').data('listeningroomid');	  
	documentReady = true;
	chatinput = $('#chatinput');
	chatroom = $('#chatroom');
  $('#chatinput').keypress(function (e) {
    if (e.which == 13) {
      sendMessage();
    }
  });
	$('#chatsubmit').click(function() {
		sendMessage();
	});
	username = $('#chatsubmit').data('username');

	//local
	// socket = io.connect('http://localhost/listen'+listeningroom_id);
	//heroku	
	socket = io.connect('https://songshare147.herokuapp.com/listen'+listeningroom_id);
	setupSocket();

	if (secondConnection && onIframeReady)
		onIframeReady(ytVideoId);
});

//creates player
var player;

function onYouTubeIframeAPIReady() {	
  	onIframeReady = function(videoId) {  
  		console.log(videoId);
  		$.get('/expireroom/'+listeningroom_id, function(data){});	
	  	player = new YT.Player('player', {
	    height: '158',
	    width: '260',
	    videoId: videoId,
	    playerVars: { /*'controls': 0 */},
	    events: {
	      'onReady': onPlayerReady,
	      'onStateChange': onPlayerStateChange
	    }	      
	  });	  
	}

	if (secondConnection && documentReady) {		
		onIframeReady(ytVideoId);
	}	
}

function onPlayerReady(event) {	
	if (isMobile.iOS()) return;
	player.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PAUSED) {
		socket.emit('paused');
    } else if (event.data == YT.PlayerState.PLAYING) {
    	socket.emit('resumed');
    }
}

function setupSocket() {
	socket.on('pauseplayer', function (data) {
		if (isMobile.iOS()) return;
		player.pauseVideo();
	});

	socket.on('playplayer', function (data) {
		if (isMobile.iOS()) return;
		player.playVideo();
	});

	socket.on('newMessage', function (data) {

		chatroom.prepend("<h5>"+data.message+"</h5>");
	});

	socket.on('connections', function (data) {	
		console.log(data.connections);
		if (data.connections > 1) {		
			secondConnection = true;	

			if (secondConnection && documentReady) {
				if (onIframeReady)
					onIframeReady(ytVideoId);
			}
		}
	});
}

function sendMessage() {
	socket.emit('newMessage', { message: "<b>" + username + "</b>" + ": " + chatinput.val() });
  $("#chatinput").val('');
}
