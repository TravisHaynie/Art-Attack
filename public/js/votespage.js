document.addEventListener('DOMContentLoaded', async () => {
    const player1Drawing = localStorage.getItem('canvasDrawing_player1');
    const player2Drawing = localStorage.getItem('canvasDrawing_player2');

    if (player1Drawing) {
        document.getElementById('picture_1').innerHTML = `<img src="${player1Drawing}" alt="Drawing 1">`;
    } else {
        document.getElementById('picture_1').innerHTML = '<p>No drawing available</p>';
    }

    if (player2Drawing) {
        document.getElementById('picture_2').innerHTML = `<img src="${player2Drawing}" alt="Drawing 2">`;
    } else {
        document.getElementById('picture_2').innerHTML = '<p>No drawing available</p>';
    }

    document.getElementById('home_button').addEventListener('click', () => {
        window.location.href = '/'; // Change this to the URL of your home screen
    });

    const sessionId = new URLSearchParams(window.location.search).get('sessionId');

    if (!sessionId) {
        alert('Session ID is missing.');
        return;
    }

    try {
        const response = await fetch(`/game-session/${sessionId}`);
        if (response.ok) {
            const session = await response.json();
            document.getElementById('picture_1').innerHTML = session.player1Art ? `<img src="${session.player1Art}" alt="Player 1 Art">` : '<p>No art available for Player 1</p>';
            document.getElementById('picture_2').innerHTML = session.player2Art ? `<img src="${session.player2Art}" alt="Player 2 Art">` : '<p>No art available for Player 2</p>';
        } else {
            const errorData = await response.json();
            alert(`Failed to load session: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error fetching session:', error);
        alert('An error occurred while fetching the session.');
    }
});
