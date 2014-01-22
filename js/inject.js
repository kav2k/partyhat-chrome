chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.control == "show"){
      sendResponse({reply: "ok"});
      showDialog();
    }
  }
);

showDialog();

function createDialog(){
  var dialog = $('<div id="dialog-phc" class="dialog-phc" title="Partyhat Control">');
  dialog.append(
    $('<button id="phc-add">').text("Add a partyhat").button().click(spawnPartyhat)
  ).append(
    $('<button id="phc-clone">').text("Clone last partyhat").button().click(
      function(){
        clonePartyhat($(".partyhat").last());
      }
    )
  ).append(
    $('<button id="phc-remove">').text("Remove last partyhat").button().click(deletePartyhat)
  ).append(
    $('<button id="phc-clear">').text("Clear all partyhats").button().click(clearPartyhats)
  );
  
  return dialog;
}

function showDialog(){
  dialog = $('#dialog-phc');
  if(!dialog.length) { dialog = createDialog(); }
  dialog.dialog( { 
    create: function(event, ui) {
        $(event.target).parent().css('position', 'fixed');
    },
    width : 240, 
    resizable: false 
  } );
}

// PARTYHATS!

function spawnPartyhat(options){
  var partyhat = $('<div class="partyhat">');
  var scale = 1;
  var angle = 0;
  if(options){
    scale = options.scale || 1;
    angle = options.angle || 0;
  }
  partyhat.append('<img class="partyhat-img">').attr('src', chrome.runtime.getURL("img/partyhat.svg"));
  partyhat.draggable();
  partyhat.rotatable({
    pivot: [0.375, 1 - 8.0/120],
    handle: $('<div id="rot_handle" class="partyhat-handle">').hide(),
    scale: scale, 
    angle: angle
  });
  partyhat.mouseenter(
    function( ev ){
      $( this ).children( ".partyhat-handle" ).show();
    }
  );
  partyhat.mouseleave( 
    function( ev ){
      $( this ).children( ".partyhat-handle" ).hide();
    }
  );
  partyhat.appendTo($('body'));
  partyhat.position({of: $(window)});
}

function clonePartyhat(hat){
  spawnPartyhat({
    scale: hat.data('scale'),
    angle: hat.data('angle')
  });
}

function deletePartyhat(){
  $(".partyhat").last().remove();
}

function clearPartyhats(){
  $(".partyhat").remove();
}