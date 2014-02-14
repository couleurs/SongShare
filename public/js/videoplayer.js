
//load iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var ytVideoId = 0;
var fetchVideoId;
var secondConnection = false;
var onSecondConnection;

$( document ).ready(function() {
  ytVideoId = $('#player').data('listeningroomid');
  if (secondConnection) {
  	console.log("called from second conncetion");
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

//for local testing
var socket = io.connect('http://localhost/listen');

//for heroku
// var socket = io.connect('https://songshare147.herokuapp.com/listen');

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
	if (data.connections > 1) {
		secondConnection = true;
		console.log(ytVideoId);
		if (ytVideoId != 0) {
			console.log("called directly");
			onIframeReady(ytVideoId);
		}
		else {
			onSecondConnection = function(videoId) {
				onIframeReady(videoId);
			}
		}
	}
});
