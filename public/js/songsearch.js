var projectId = 'YOUR_PROJECT_ID';
var apiKey = 'AIzaSyCuPt16S-rjaXXDoFLT-_RJaumU4z9qSRI';

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  gapi.client.load('youtube', 'v3', function() {
    authReady();
  });
};

var authReady = function() {
  $('#search-bar').keyup(function() {
    console.log($(this).val());

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
        var htmlStr = "<div class='col-xs-6 col-sm-3'>" +
                        "<a href='pickfriend'>" +
                          "<img src=" + result.snippet.thumbnails.high.url + " class='img-responsive album-selector'>" +
                          "<p>" + result.snippet.title + "</p>" +
                        "</a>" +
                      "</div>"
        $('#yt-results').append(htmlStr);
      }
    });

  });
};