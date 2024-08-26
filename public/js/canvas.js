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
//   saveEl.addEventListener('click', function() {
//       var dataURL = canvas.toDataURL({
//           format: 'png'
//       });
//       localStorage.setItem('canvasDrawing', dataURL);
//       alert('Drawing saved!');
//   });
//   setTimeout(() => {
//     window.location.href = '/votescreen'; // Replace '/redirect-page' with the URL of the page you want to redirect to
// }, 6000); // 1 minute
saveEl.addEventListener('click', async function() {
    // const dataURL = canvas.toDataURL('image/png');
    const dataURL = "hello";
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId'); // Get sessionId from the URL
    const playerId = JSON.parse(sessionStorage.getItem('user')).id; // Assuming player ID is stored in session storage

    // Convert dataURL to Blob
    const dataUrlToBlob = (dataURL) => {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const blob = dataUrlToBlob(dataURL);

    // Create FormData object
    const formData = new FormData();
    formData.append('image', blob, 'drawing.png');
    formData.append('sessionId', sessionId);
    formData.append('createdBy', playerId);

    try {
        const response = await fetch('/save-drawing', {
            method: 'POST',
            body: formData, // Send as FormData
        });

        if (response.ok) {
            alert('Drawing saved!');
            setTimeout(() => {
                window.location.href = `/votescreen?sessionId=${sessionId}`;
            }, 10000); // Redirect to vote screen after saving
        } else {
            console.error('Failed to save drawing');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

});