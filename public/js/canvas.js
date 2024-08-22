document.addEventListener('DOMContentLoaded', () => {
  if (typeof fabric === 'undefined') {
      console.error('Fabric.js is not loaded. Check the script source.');
      return;
  }

  var canvas = new fabric.Canvas('c', {
      isDrawingMode: true
  });

  fabric.Object.prototype.transparentCorners = false;

  var drawingModeEl = document.getElementById('drawing-mode');
  var drawingOptionsEl = document.getElementById('drawing-mode-options');
  var drawingColorEl = document.getElementById('drawing-color');
  var drawingShadowColorEl = document.getElementById('drawing-shadow-color');
  var clearEl = document.getElementById('clear-canvas');
  var saveEl = document.getElementById('save-canvas');

  if (!drawingModeEl || !drawingOptionsEl || !drawingColorEl || !drawingShadowColorEl || !clearEl || !saveEl) {
      console.error('One or more required elements are missing from the HTML.');
      return;
  }

  // Clear canvas
  clearEl.onclick = () => { canvas.clear(); };

  // Toggle drawing mode
  drawingModeEl.onclick = () => {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      if (canvas.isDrawingMode) {
          drawingModeEl.textContent = 'Cancel drawing mode';
          drawingOptionsEl.style.display = '';
      } else {
          drawingModeEl.textContent = 'Enter drawing mode';
          drawingOptionsEl.style.display = 'none';
      }
  };

  // Set default brush (e.g., PencilBrush)
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

  // Update brush color
  drawingColorEl.addEventListener('change', function() {
      var brush = canvas.freeDrawingBrush;
      if (brush) {
          brush.color = this.value;
      }
  });

  // Update brush shadow color
  drawingShadowColorEl.addEventListener('change', function() {
      var brush = canvas.freeDrawingBrush;
      if (brush) {
          brush.shadow.color = this.value;
      }
  });

  // Initialize brush settings
  if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
  }

  // Save canvas content to local storage
  saveEl.addEventListener('click', function() {
      var dataURL = canvas.toDataURL({
          format: 'png'
      });
      localStorage.setItem('canvasDrawing', dataURL);
      alert('Drawing saved!');
  });
  setTimeout(() => {
    window.location.href = '/votescreen'; // Replace '/redirect-page' with the URL of the page you want to redirect to
}, 6000); // 1 minute
});
