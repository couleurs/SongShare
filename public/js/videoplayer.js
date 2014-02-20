
//load iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytVideoId;
var fetchVideoId;
var secondConnection = false;
var onSecondConnection;

$( document ).ready(function() {
  ytVideoId = $('#player').data('videoid');
  if (secondConnection) {
  	console.log("called from second connection");
  	onSecondConnection(ytVideoId);
  }
});

//creates player
var player;
var onIframeReady;

function onYouTubeIframeAPIReady() {	
  	onIframeReady = function(videoId) {  
  		console.log(videoId);	
	  	player = new YT.Player('player', {
	    height: '182',
	    width: '300',
	    videoId: videoId,
	    playerVars: { /*'controls': 0 */},
	    events: {
	      'onReady': onPlayerReady,
	      'onStateChange': onPlayerStateChange
	    }
	  });	  
	}	
}

// for local testing
var socket = io.connect('http://localhost/listen');
//for heroku
//var socket = io.connect('https://songshare147.herokuapp.com/listen');

function onPlayerReady(event) {
	player.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PAUSED) {
		socket.emit('paused');
    } else if (event.data == YT.PlayerState.PLAYING) {
    	socket.emit('resumed');
    }
}

socket.on('pauseplayer', function (data) {
	player.pauseVideo();
});

socket.on('playplayer', function (data) {
	player.playVideo();
});

socket.on('connections', function (data) {	
	console.log(data.connections);
	if (data.connections > 1) {		
		secondConnection = true;	
		console.log(ytVideoId);	
		if (ytVideoId) {			
			onIframeReady(ytVideoId);
		}
		else {
			onSecondConnection = function(videoId) {
				console.log("called");
				onIframeReady(videoId);
			}
		}
	}
});
