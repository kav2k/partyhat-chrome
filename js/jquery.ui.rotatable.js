// Originally from https://github.com/godswearhats/jquery-ui-rotatable
// Modified by Alexander Kashev

(function( $, undefined ) {
    
$.widget("ui.rotatable", $.ui.mouse, {
  
  options: {
    handle: false,
      angle: 0,
      scale: 1
  },

  handle: function(handle) {
    if (handle === undefined) {
      return this.options.handle;
    }
    this.options.handle = handle;
  },
    
  angle: function(angle) {
    if (angle === undefined) {
      return this.options.angle;
    }
    this.options.angle = angle;
    performRotation(this.element, this.options.angle, this.options.scale);
  },
  
  _create: function() {
    var handle;
    if (!this.options.handle) {
      handle = $(document.createElement('div'));
        handle.addClass('partyhatify-ui-rotatable-handle');
    }
    else {
        handle = this.options.handle;
    }
    handle.appendTo(this.element);

    handle.draggable({ helper: 'clone', start: dragStart });
    handle.on('mousedown', startRotate);

    this.element.data('scale', this.options.scale);
    this.element.data('angle', this.options.angle);
    performRotation(this.element, this.options.angle, this.options.scale);
    handle.css('transform','scale('+ 1.0/scale +')');
    handle.css('-webkit-transform','scale('+ 1.0/scale +')');

    if (this.options.pivot) {
      this.element.data('xPivot', this.options.pivot[0]);
      this.element.data('yPivot', this.options.pivot[1]);
      this.element.css(
        '-webkit-transform-origin', 
        this.options.pivot.map(function(a){return 100*a+"%"}).join(" ")
      );
    }
  },

    _destroy: function() {
        this.element.removeClass('partyhatify-ui-rotatable');
        this.element.find('.partyhatify-ui-rotatable-handle').remove();
    }
});

var elementBeingRotated, mouseStartAngle, elementStartAngle, elementHandle;
$(document).on('mouseup', stopRotate);

function getElementCenter(el) {
  var elementOffset = getElementOffset(el);
  var xOffset = el.width() * ((el.data('xPivot')) ? el.data('xPivot') : 0.5);
  var yOffset = el.height() * ((el.data('yPivot')) ? el.data('yPivot') : 0.5);
  var elementCentreX = elementOffset.left + xOffset;
  var elementCentreY = elementOffset.top + yOffset;
  return Array(elementCentreX, elementCentreY);
};

function getElementOffset(el) {
  performRotation(el, 0, 1);
  var offset = el.offset();
  performRotation(el, el.data('angle'), el.data('scale'));
  return offset;
};

function performRotation(el, angle, scale) {
  var value = 'scale(' + scale + ') rotate(' + angle + 'rad)';
  el.css('transform',value);
  el.css('-webkit-transform',value);
};

function dragStart(event) {
  if (elementBeingRotated) return false;
};

function rotateElement(event) {
  if (!elementBeingRotated) return false;

  var center = getElementCenter(elementBeingRotated);
  var xFromCenter = event.pageX - center[0];
  var yFromCenter = event.pageY - center[1];
  var mouseAngle = Math.atan2(yFromCenter, xFromCenter);
  var rotateAngle = mouseAngle - mouseStartAngle + elementStartAngle;
  var length = Math.max(10, Math.sqrt(xFromCenter*xFromCenter + yFromCenter*yFromCenter));
  var scale = elementStartScale * length / elementStartLength;
    
  
  performRotation(elementBeingRotated, rotateAngle, scale);
  elementHandle.css('transform','scale('+ 1.0/scale +')');
  elementHandle.css('-webkit-transform','scale('+ 1.0/scale +')');
  elementBeingRotated.data('angle', rotateAngle);
  elementBeingRotated.data('scale', scale);
  
  return false;
};

function startRotate(event) {
  elementBeingRotated = $(this).parent();
  elementHandle = $(this);
  var center = getElementCenter(elementBeingRotated);
  var startXFromCenter = event.pageX - center[0];
  var startYFromCenter = event.pageY - center[1];
  mouseStartAngle = Math.atan2(startYFromCenter, startXFromCenter);
  elementStartAngle = elementBeingRotated.data('angle');
  elementStartScale = elementBeingRotated.data('scale');
  elementStartLength = Math.sqrt(startYFromCenter*startYFromCenter + startXFromCenter*startXFromCenter);

  $(document).on('mousemove', rotateElement);
  
  return false;
};

function stopRotate(event) {
  if (!elementBeingRotated) return;
  $(document).unbind('mousemove');
  setTimeout( function() { elementBeingRotated = false; }, 10 );
  return false;
};

})(jQuery);
