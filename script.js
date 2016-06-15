$(document).ready(function() {
  //Function to get url params
  $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
    }
    //Save get url param id to var id
  var id = $.urlParam('id');

  //Building object built out of GET response data
  var building = {
    id: undefined,
    name: undefined,
    address: undefined,
    images: {
      today: undefined,
      future: undefined,
      history: undefined
    },
    story: {
      today: undefined,
      future: undefined,
      history: undefined
    }
  }

  //Function to append data to html elements
  var addBuildingData = function() {
    $('#title').html(building.name);
    $('#img-today').attr('src', building.images.today);
    $('#img-future').attr('src', building.images.future);
    $('#img-history').attr('src', building.images.history);
    $('#future').html(building.story.future);
    $('#history').html(building.story.history);
    $('#today').html(building.story.today);
    $('#name').html(building.name + '.');
  }

  //Function to GET all data by making two get requests and applying it to building object
  var getData = function() {
    //GET position of interest building info
    $.get('http://build.dia.mah.se/pois/' + id, function(data) {
      building.id = data['results'][0]['id'];
      building.name = data['results'][0]['extras']['info'].name;
      building.address = data['results'][0]['extras']['info']['address'].full;
    });

    //GET building story data
    $.get('http://build.dia.mah.se/ugc/' + id + '/stories', function(data) {
      building.images.today = data['stories'][0]['today'].image;
      building.images.future = data['stories'][0]['future'].image;
      building.images.history = data['stories'][0]['history'].image;
      building.story.today = data['stories'][0]['today'].story;
      building.story.future = data['stories'][0]['future'].story;
      building.story.history = data['stories'][0]['history'].story;
      //Add response data to building object
      addBuildingData();
    });
  }

  //Get data and append it to bulding object
  getData();

  //Function for voting on future plans
  $('#upVote').bind('click', function() {
    $.get('http://build.dia.mah.se/ugc/01749/votes', function(data, status) {
      console.log(data);
      if (status === 'success') {
        var upVoteCount = data['votes'][0]['up'];
        var downVoteCount = data['votes'][0]['down'];
        upVoteCount++
        $.ajax({
          url: 'http://build.dia.mah.se/ugc/' + id + '/votes',
          type: 'PUT',
          data: {
            up: upVoteCount,
            down: downVoteCount
          },
          success: function(response) {
            console.log(response);
            console.log('voting up');
          }
        });
      }
    });
  });
  $('#downVote').bind('click', function() {
    $.get('http://build.dia.mah.se/ugc/01749/votes', function(data, status) {
      console.log(data);
      if (status === 'success') {
        var upVoteCount = data['votes'][0]['up'];
        var downVoteCount = data['votes'][0]['down'];
        downVoteCount++
        $.ajax({
          url: 'http://build.dia.mah.se/ugc/' + id + '/votes',
          type: 'PUT',
          data: {
            up: upVoteCount,
            down: downVoteCount
          },
          success: function(response) {
            console.log(response);
            console.log('voting down');
          }
        });
      }
    });
  });
  /*
  $.post('http://build.dia.mah.se/ugc/' + id + '/votes', {
    up: upVoteCount,
    down: downVoteCount
  }, function(data, status) {
    console.log(data);
  });
  */
});
