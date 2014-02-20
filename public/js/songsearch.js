var projectId = 'YOUR_PROJECT_ID';
var apiKey = 'AIzaSyCuPt16S-rjaXXDoFLT-_RJaumU4z9qSRI';

var receiver_name;

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load('youtube', 'v3', function() {
    receiver_name = $('#receiver').data('name');
    console.log(receiver_name);
    authReady();
  });
};

var authReady = function() {
  $('#search-bar').keyup(function() {
    var request = gapi.client.youtube.search.list({
      q: $(this).val(),
      part: 'snippet',
      maxResults: 8
    });

    request.execute(function(response) {  
      var results = response.result.items;            
      $('#yt-results').html("");    
      for (i in results) {
        result = results[i];
        var videoId = result.id.videoId;
        var htmlStr = "<div class='col-xs-6 col-sm-3'>" +
                        
                          "<img src=" + result.snippet.thumbnails.high.url + " class='img-responsive album-selector'>" +
                          "<p>" + result.snippet.title + "</p>" +
                          "<form id='formListenTogether' name='friend' method='post' action='/listen' role='form'>" +
                            "<div class='form-group'>" +
                              "<input type='hidden' name='username' value='" + receiver_name + "' class='form-control'>" +
                              "<input type='hidden' name='video_id' value='" + videoId + "' class='form-control'>" +
                            "</div>" +
                            "<button type='submit' class='btn btn-info'>Choose Song</button>" +
                          "</form>"

                      "</div>"
        $('#yt-results').append(htmlStr);
      }
    });

  });
};