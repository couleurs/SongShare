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
      part: 'snippet'
    });

    request.execute(function(response) {
      console.log(response);
      var str = JSON.stringify(response.result);
      console.log(str);
    });

  });
};