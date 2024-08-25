document.addEventListener('DOMContentLoaded', () => {
    const sessionId = new URLSearchParams(window.location.search).get('session');
    const user = JSON.parse(sessionStorage.getItem('user'));

    console.log('Session ID:', sessionId);
    console.log('User:', user);

    if (!sessionId || !user) {
        alert('Invalid session or user not logged in.');
        console.log(sessionId);
        console.log(user);
        window.location.href = '/';
        return;
    }

    const gameSessionElement = document.getElementById('gameSession');
    gameSessionElement.textContent = `Session ID: ${sessionId}`;

    // Check the session to see if two players are present
    async function checkSessionStatus(sessionId) {
        try {
            const response = await fetch(`/game-session/${sessionId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch session status.');
            }
            const data = await response.json();
<<<<<<< HEAD

            if (data.player2) {
                // Session is full
                console.log('Session is full:', data);
                return { full: true };
            } else {
                // Session has room
                console.log('Session has room:', data);
=======
    
            if (data.player1 && data.player2) {
                // Redirect to the canvas page if both players are present
                window.location.href = `/canvas?sessionId=${sessionId}`;
            } else if (data.player2) {
                // Session is full
                return { full: true };
            } else {
                // Session has room
>>>>>>> main
                return { full: false, player1: data.player1 };
            }
        } catch (error) {
            console.error('Error checking session status:', error);
            alert('An error occurred while checking the session status.');
        }
    }
    
    // Function to join the session
    async function joinSession() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const sessionId = new URLSearchParams(window.location.search).get('sessionId');
<<<<<<< HEAD

=======
    
>>>>>>> main
        if (!user || !sessionId) {
            alert('You must be logged in and have a valid session to join.');
            return;
        }
<<<<<<< HEAD

        try {
            const sessionStatus = await checkSessionStatus();

            if (sessionStatus.full) {
                alert('Session is full.');
                return;
            }

            const response = await fetch('/game-session', {
                method: 'POST',
                body: JSON.stringify({
                    sessionId: sessionId,
                    userId: user.id
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Joined session successfully:', data);
                window.location.href = `/canvas?sessionId=${sessionId}`;
            } else {
                const errorData = await response.json();
                console.error(`Failed to join session: ${errorData.message}`);
                alert(`Failed to join session: ${errorData.message}`);
            }
=======
    
        try {
            const sessionStatus = await checkSessionStatus(sessionId);
    
            if (sessionStatus.full) {
                alert('Session is full.');
                return;
            }
    
            const response = await fetch('/game-session', {
                method: 'POST',
                body: JSON.stringify({
                    sessionId: sessionId,
                    userId: user.id
                }),
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    window.location.href = `/canvas?sessionId=${sessionId}`;
                } else {
                    alert(`Failed to join session: ${data.message}`);
                }
            } else {
                const errorData = await response.json();
                alert(`Failed to join session: ${errorData.message}`);
            }
>>>>>>> main
        } catch (error) {
            console.error('Error joining session:', error);
            alert('An error occurred while joining the session.');
        }
    }
<<<<<<< HEAD

    async function init() {
        // Initial status check with a slight delay to ensure session data is correctly updated
        setTimeout(async () => {
            await checkSessionStatus();
        }, 2000); // 2 seconds delay

        const statusInterval = setInterval(checkSessionStatus, 6000); // Check every 6 seconds

        setTimeout(async () => {
            await joinSession();
            clearInterval(statusInterval); // Stop checking status once joined
        }, 12000); // Delay to ensure session and user are correctly set

        // Cleanup interval if user navigates away or session becomes invalid
        window.addEventListener('beforeunload', () => clearInterval(statusInterval));
    }

    init();
});

=======
    
    
    async function init(sessionId) {
        await checkSessionStatus(sessionId);
        let intervalId = setInterval(async () => {
            await checkSessionStatus(sessionId); 
        }, 1000); 
    
        // setTimeout(async () => {
        //     await joinSession();
        //     clearInterval(intervalId); // Stop checking status once joined
        // }, 12000); // Delay to ensure session and user are correctly set
    
        // Cleanup interval if user navigates away or session becomes invalid
        window.addEventListener('beforeunload', () => clearInterval(intervalId));
    }
    
    init(sessionId);

});
>>>>>>> main
