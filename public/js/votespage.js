document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session'); // Get sessionId from the URL
    console.log("Session ID:", sessionId);
    try {
        // Fetch the game session details
        const sessionResponse = await fetch(`/game-session/${sessionId}`);
        const gameSession = await sessionResponse.json();

        if (!gameSession) {
            throw new Error('Game session not found');
        }

        // Fetch the drawings for the session
        const drawingsResponse = await fetch(`/get-drawings?session=${sessionId}`);
        const drawings = await drawingsResponse.json();

        // Assuming the response contains an array with two drawings for Player 1 and Player 2
        const player1Drawing = drawings.find(drawing => drawing.createdBy === gameSession.player1); // Player 1's drawing
        const player2Drawing = drawings.find(drawing => drawing.createdBy === gameSession.player2); // Player 2's drawing

        // Display Player 1's drawing
        if (player1Drawing) {
            const imgPlayer1 = document.getElementById('image_player_1');
            imgPlayer1.src = player1Drawing.imageData;
        }

        // Display Player 2's drawing
        if (player2Drawing) {
            const imgPlayer2 = document.getElementById('image_player_2');
            imgPlayer2.src = player2Drawing.imageData;
        }

    } catch (error) {
        console.error('Error fetching game session or drawings:', error);
    }
});
