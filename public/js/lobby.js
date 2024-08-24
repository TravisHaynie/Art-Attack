document.addEventListener('DOMContentLoaded', () => {
    const sessionId = new URLSearchParams(window.location.search).get('sessionId');
    const user = JSON.parse(sessionStorage.getItem('user'));

    console.log('Session ID:', sessionId);
    console.log('User:', user);

    if (!sessionId || !user) {
        alert('Invalid session or user not logged in.');
        window.location.href = '/';
        return;
    }

    const statusElement = document.getElementById('status');
    const gameSessionElement = document.getElementById('gameSession');
    gameSessionElement.textContent = `Session ID: ${sessionId}`;

    // Function to periodically check if both players are in the session
    async function checkSessionStatus() {
        try {
            const response = await fetch(`/game-session/${sessionId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch session status.');
            }
            const data = await response.json();

            if (data.player2) {
                // Redirect to the canvas if both players are present
                window.location.href = `/canvas?sessionId=${sessionId}`;
            } else {
                // Update status element if waiting for another player
                statusElement.textContent = `Waiting for another player... (${data.player1 ? 1 : 0}/2)`;
            }
        } catch (error) {
            console.error('Error checking session status:', error);
            alert('An error occurred while checking the session status.');
        }
    }

    // Function to join the session
    async function joinSession() {
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (!user) {
            alert('You must be logged in to join a game session.');
            return;
        }

        try {
            const response = await fetch('/join-session', {
                method: 'POST',
                body: JSON.stringify({
                    sessionId: sessionId,
                    userId: user.id // Send the user ID
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Joined session successfully:', data);
                // Optionally update the UI or perform additional actions here
            } else {
                const errorData = await response.json();
                alert(`Failed to join session: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error joining session:', error);
            alert('An error occurred while joining the session.');
        }
    }

    // Initial check
    checkSessionStatus();
    setInterval(checkSessionStatus, 2000); // Check every 2 seconds

    // Attempt to join the session after checking status
    setTimeout(joinSession, 1000); // Delay to ensure session and user are correctly set
});
