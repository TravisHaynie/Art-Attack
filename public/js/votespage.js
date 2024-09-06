document.addEventListener('DOMContentLoaded', async () => {
    localStorage.removeItem('votedForPlayer');
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId'); // Get sessionId from the URL
    const imgPlayer1 = document.getElementById('image_player_1');
    const imgPlayer2 = document.getElementById('image_player_2');
    const timeRemainingEl = document.getElementById('time_remaining');
    const votesPlayer1 = document.getElementById('votes_player_1');
    const votesPlayer2 = document.getElementById('votes_player_2');
    const winnerAnnouncementEl = document.getElementById('winner_announcement');
    const winnerTextEl = document.getElementById('winner_text');
 

    let images;

    try {
        // Fetch the images for this session
        const response = await fetch(`/get-images?sessionId=${sessionId}`);
        images = await response.json();
        console.log(images);
        // Get the image elements


        // Display the images and vote counts in the respective elements
        if (images.length >= 2) {
            console.log(images[0])
            imgPlayer1.src = images[0].imageData;
            imgPlayer2.src = images[1].imageData;

            votesPlayer1.textContent = `Votes: ${images[0].votes}`; // Player 1's votes
            votesPlayer2.textContent = `Votes: ${images[1].votes}`; // Player 2's votes
        } else {
            console.error('Not enough images found for this session');
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }

    // Add event listeners for the vote buttons
    document.getElementById('p1_button').addEventListener('click', async () => {
        if (!localStorage.getItem('votedForPlayer')) {
            await voteForPlayer(images[0].createdBy, sessionId);
            updateVoteCount(0); 
            localStorage.setItem('votedForPlayer', 'p1'); 
        } else if (localStorage.getItem('votedForPlayer') === 'p2') {
            console.log('You have already voted for Player 2. You cannot vote for both players.');
        } else {
            console.log('You have already voted for Player 1');
        }
    });
    
    document.getElementById('p2_button').addEventListener('click', async () => {
        if (!localStorage.getItem('votedForPlayer')) {
            await voteForPlayer(images[1].createdBy, sessionId);
            updateVoteCount(1); 
            localStorage.setItem('votedForPlayer', 'p2'); 
        } else if (localStorage.getItem('votedForPlayer') === 'p1') {
            console.log('You have already voted for Player 1. You cannot vote for both players.');
        } else {
            console.log('You have already voted for Player 2');
        }
    });

    // Back to Home button functionality
    document.getElementById('home_button').addEventListener('click', () => {
        window.location.href = '/'; // Redirect to the home page
    });

    // Periodically update the vote counts every 5 seconds
    setInterval(async () => {
        try {
            const response = await fetch(`/get-images?sessionId=${sessionId}`);
            images = await response.json();

            if (images.length >= 2) {
                votesPlayer1.textContent = `Votes: ${images[0].votes}`; // Player 1's votes
                votesPlayer2.textContent = `Votes: ${images[1].votes}`; // Player 2's votes
            }
        } catch (error) {
            console.error('Error updating vote counts:', error);
        }
    }, 5000); // Update every 5 seconds

    let timeRemaining = 30;
    const countdownInterval = setInterval(() => {
        timeRemaining--;
        timeRemainingEl.textContent = `Time Remaining: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            determineWinner(); // Determine the winner when time runs out
        }
    }, 1000);

    function determineWinner() {
        let winnerText = '';
        if (images[0].votes > images[1].votes) {
            winnerText = 'Player 1 is the winner!';
        } else if (images[1].votes > images[0].votes) {
            winnerText = 'Player 2 is the winner!';
        } else {
            winnerText = 'It\'s a tie!';
        }

        winnerTextEl.textContent = winnerText;
        winnerAnnouncementEl.style.display = 'block';
    }
});



async function voteForPlayer(playerId, sessionId) {
    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: sessionId,
                votedFor: playerId,
            }),
        });

        if (response.ok) {
        } else {
            console.error('Failed to submit vote');
        }
    } catch (error) {
        console.error('Error submitting vote:', error);
    }
}

function updateVoteCount(playerIndex) {
    const voteElement = playerIndex === 0 
        ? document.getElementById('votes_player_1') 
        : document.getElementById('votes_player_2');
    
    const currentVotes = parseInt(voteElement.textContent.split(': ')[1], 10);
    voteElement.textContent = `Votes: ${currentVotes + 1}`;
}


function updateVoteCountDisplay(votes1, votes2) {
    votesPlayer1.textContent = `Votes: ${votes1}`;
    votesPlayer2.textContent = `Votes: ${votes2}`;

 
}
async function voteForPlayer(playerId, sessionId) {
    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: sessionId,
                votedFor: playerId,
            }),
        });

        if (!response.ok) {
            console.error('Failed to submit vote');
        }
    } catch (error) {
        console.error('Error submitting vote:', error);
    }
}

