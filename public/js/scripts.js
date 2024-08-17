(function() {
  function setupCanvas(canvasId, modeButtonId, optionsId, selectorId, colorId, lineWidthId, shadowWidthId, shadowOffsetId, shadowColorId, clearButtonId) {
    var canvas = new fabric.Canvas(canvasId, { isDrawingMode: true });
    fabric.Object.prototype.transparentCorners = false;

    var drawingModeEl = document.getElementById(modeButtonId);
    var drawingOptionsEl = document.getElementById(optionsId);
    var drawingModeSelector = document.getElementById(selectorId);
    var drawingColorEl = document.getElementById(colorId);
    var drawingLineWidthEl = document.getElementById(lineWidthId);
    var drawingShadowWidth = document.getElementById(shadowWidthId);
    var drawingShadowOffset = document.getElementById(shadowOffsetId);
    var drawingShadowColorEl = document.getElementById(shadowColorId);
    var clearEl = document.getElementById(clearButtonId);

    clearEl.onclick = function() { canvas.clear(); };

    drawingModeEl.onclick = function() {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      if (canvas.isDrawingMode) {
        drawingModeEl.innerHTML = 'Cancel drawing mode';
        drawingOptionsEl.style.display = '';
      } else {
        drawingModeEl.innerHTML = 'Enter drawing mode';
        drawingOptionsEl.style.display = 'none';
      }
    };

    drawingModeSelector.onchange = function() {
      // Update brush based on selection
      var brushType = this.value;
      switch (brushType) {
        case 'hline':
          canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
          // Define the pattern for horizontal lines
          break;
        case 'vline':
          canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
          // Define the pattern for vertical lines
          break;
        case 'square':
          canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
          // Define the pattern for squares
          break;
        case 'diamond':
          canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
          // Define the pattern for diamonds
          break;
        case 'texture':
          canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
          // Define the pattern for textures
          break;
        default:
          canvas.freeDrawingBrush = new fabric[brushType + 'Brush'](canvas);
      }
      updateBrushSettings();
    };

    function updateBrushSettings() {
      var brush = canvas.freeDrawingBrush;
      if (brush) {
        brush.color = drawingColorEl.value;
        brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        brush.shadow = new fabric.Shadow({
          blur: parseInt(drawingShadowWidth.value, 10) || 0,
          offsetX: parseInt(drawingShadowOffset.value, 10) || 0,
          offsetY: parseInt(drawingShadowOffset.value, 10) || 0,
          color: drawingShadowColorEl.value
        });
      }
    }

    drawingColorEl.onchange = updateBrushSettings;
    drawingLineWidthEl.onchange = updateBrushSettings;
    drawingShadowWidth.onchange = updateBrushSettings;
    drawingShadowOffset.onchange = updateBrushSettings;
    drawingShadowColorEl.onchange = updateBrushSettings;

    // Initialize settings
    updateBrushSettings();
  }

  setupCanvas(
    'c1', 'drawing-mode-1', 'drawing-mode-options-1',
    'drawing-mode-selector-1', 'drawing-color-1', 'drawing-line-width-1',
    'drawing-shadow-width-1', 'drawing-shadow-offset-1', 'drawing-shadow-color-1',
    'clear-canvas-1'
  );

  setupCanvas(
    'c2', 'drawing-mode-2', 'drawing-mode-options-2',
    'drawing-mode-selector-2', 'drawing-color-2', 'drawing-line-width-2',
    'drawing-shadow-width-2', 'drawing-shadow-offset-2', 'drawing-shadow-color-2',
    'clear-canvas-2'
  );

})();
