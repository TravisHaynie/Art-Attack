document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session'); // Get sessionId from the URL

    try {
        // Fetch the game session details to get player IDs
        const gameSessionResponse = await fetch(`/game-session/${sessionId}`);
        const gameSession = await gameSessionResponse.json();

        // Fetch the drawings for this session
        const response = await fetch(`/get-drawings?session=${sessionId}`);
        const drawings = await response.json();

        // Find the drawings for player 1 and player 2 based on their IDs
        const player1Drawing = drawings.find(drawing => drawing.createdBy === gameSession.player1);
        const player2Drawing = drawings.find(drawing => drawing.createdBy === gameSession.player2);

        // If player 1's drawing exists, display it
        if (player1Drawing) {
            const imgPlayer1 = document.getElementById('image_player_1');
            imgPlayer1.src = player1Drawing.imageData;
        }

        // If player 2's drawing exists, display it
        if (player2Drawing) {
            const imgPlayer2 = document.getElementById('image_player_2');
            imgPlayer2.src = player2Drawing.imageData;
        }
        
    } catch (error) {
        console.error('Error fetching drawings:', error);
    }
});
