var widget = (function() {
  let _radioStations = [];
  let _currentlyPlaying = null;
  let _container;
  const _durationToggleStationMenu = 600;
 
  function _initRadioWidgetElements() {
    _initBar();
    _initBody();
    _initFooter();
  }

  function initRadioWidget(parentNodeElement) {
    _container = $('<div class="radio-widget"></div>').appendTo($(parentNodeElement));
    _initRadioWidgetElements();
    $.when(_getRadioStations())
     .done(_initRadioStations)
  }

  function _initBar() {
    _container.append('<div class="radio-bar"><i class="back-arrow"></i><i class="turn-off"></i><h1>STATIONS</h1></div>');
  }
  
  function _getStationName(uuid) {
    let station = _radioStations.find(s => s.uuid === uuid);
    return station.name || null;
  }
  
   function _getRadioStations() {
    return $.get('https://api.myjson.com/bins/3n97o', function(data) {
      _radioStations = data.radioStations;
    });
  }
  
  function _initRadioStations() {
     let list = _container.find($('.radio-stations'));
     _radioStations.forEach(function(station) {
        list.append('<div class="station-menu"><button class="minus"></button><img class="station-img"></img><button class="plus"></button></div><li data-uuid="' + station.uuid + '">' + station.name + '<span class="fm">' + station.f + '</span></li>');
    });
  }
  
  function _toggleStationMenu() {
    _container.find($('div.station-menu')).hide(_durationToggleStationMenu);
    if(!($(this).prev('div').is(':visible'))) {
      $(this).prev('div').show(_durationToggleStationMenu);
      _currentlyPlaying = _getStationName($(this).attr('data-uuid'));
    }
    else {
      _currentlyPlaying = null;
    }
    _updateFooter();
  }

  function _initBody() {
    let rMain = _container.append('<div class="radio-body"><ul class="radio-stations"></ul></div>');
    rMain.on('click', 'li', _toggleStationMenu);
  }
  
  function _updateFooter() {
    let currentlyPlayingSelector = _container.find($('.radio-footer .currently-playing'));
    if(_currentlyPlaying) {
      $('.current-station-name').html(_currentlyPlaying);
      currentlyPlayingSelector.css('display', 'block');
    }
    else {
      currentlyPlayingSelector.css('display', 'none');
    }
  }

  function _initFooter() {
    let radioFooter = $('<div class="radio-footer"></div>').appendTo(_container);
    let currentlyPlayingNode = '<div class="currently-playing" style="display:none;"><p class="header">CURRENTLY PLAYING</p><p class="current-station-name"></p></div>';
    radioFooter.append(currentlyPlayingNode);
  }

  return {
    initRadioWidget: initRadioWidget
  }
})();

$(document).ready(widget.initRadioWidget.bind(this, document.getElementById("radio-widget")));