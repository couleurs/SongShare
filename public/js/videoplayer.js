
//load iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//creates player
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'UDoEqBas4Y0',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

var otherUserOnline = false;
var playerReady = false;
function onPlayerReady(event) {
	if (otherUserOnline)
		player.playVideo();
	else playerReady = true;
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PAUSED) {
		socket.emit('paused');
    } else if (event.data == YT.PlayerState.PLAYING) {
    	socket.emit('resumed');
    }
}

var socket = io.connect('http://localhost/listen');
socket.on('pauseplayer', function (data) {
	player.pauseVideo();
});

socket.on('playplayer', function (data) {
	player.playVideo();
});

socket.on('connections', function (data) {
	if (data.connections > 1) {
		otherUserOnline = true;

		if (playerReady)
			player.playVideo();
	}
});
