document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the saved drawing from localStorage
    const canvasDrawing = localStorage.getItem('canvasDrawing');
    
    if (canvasDrawing) {
        // Display the saved drawing in both picture containers
        document.getElementById('picture_1').innerHTML = `<img src="${canvasDrawing}" alt="Drawing 1">`;
    } else {
        document.getElementById('picture_1').innerHTML = '<p>No drawing available</p>';
    }

    document.getElementById('home_button').addEventListener('click', () => {
        window.location.href = '/'; // Change this to the URL of your home screen
    });
});