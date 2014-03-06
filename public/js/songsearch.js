var projectId = 'YOUR_PROJECT_ID';
var apiKey = 'AIzaSyCuPt16S-rjaXXDoFLT-_RJaumU4z9qSRI';

var receiver_name;

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load('youtube', 'v3', function() {
    //receiver_name = $('#receiver').data('name');
    authReady();
  });
};

var authReady = function() {
  $('#search-bar').keyup(function() {
    var request = gapi.client.youtube.search.list({
      q: $(this).val(),
      type: 'video',
      part: 'snippet',
      regionCode: 'US',
      videoCategoryId: '10',
      maxResults: 8
    });

    request.execute(function(response) {  
      var results = response.result.items;            
      $('#yt-results').html("");    
      for (i in results) {
        result = results[i];
        var videoId = result.id.videoId;
        var videoTitle = result.snippet.title;
        var thumbnailUrl = result.snippet.thumbnails.high.url;
        var htmlStr = "<div class='col-xs-12 col-sm-4 col-lg-3 video-selector'>" +
                        "<h4 class='video-title'>" + videoTitle + "</h4>" +
                        "<img src=" + thumbnailUrl + " class='img-responsive img-thumbnail'>" +
                        "<form id='formListenTogether' name='friend' method='post' action='/pickfriend' role='form'>" +
                          "<div class='form-group'>" +
//                            "<input type='hidden' name='username' value='" + receiver_name + "' class='form-control'>" +
                            "<input type='hidden' name='video_id' value='" + videoId + "' class='form-control'>" +
                            "<input type='hidden' name='video_title' value='" + videoTitle + "' class='form-control'>" +
                            "<input type='hidden' name='thumbnail_url' value='" + thumbnailUrl + "' class='form-control'>" +
                          "</div>" +
                          "<button type='submit' class='btn btn-sm btn-info'>Share this</button>" +
                        "</form>" +
                      "</div>"
        $('#yt-results').append(htmlStr);
      }
    });

  });
};