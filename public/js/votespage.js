document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId'); // Get sessionId from the URL

    let images;

    try {
        // Fetch the images for this session
        const response = await fetch(`/get-images?sessionId=${sessionId}`);
        images = await response.json();

        // Get the image elements
        const imgPlayer1 = document.getElementById('image_player_1');
        const imgPlayer2 = document.getElementById('image_player_2');
        const votesPlayer1 = document.getElementById('votes_player_1');
        const votesPlayer2 = document.getElementById('votes_player_2');

        // Display the images and vote counts in the respective elements
        if (images.length >= 2) {
            imgPlayer1.src = images[0].imageData; // Player 1's image
            imgPlayer2.src = images[1].imageData; // Player 2's image
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
        await voteForPlayer(images[0].createdBy, sessionId);
        updateVoteCount(0); // Update Player 1's vote count
        console.log('Voted for Player 1');
    });

    document.getElementById('p2_button').addEventListener('click', async () => {
        await voteForPlayer(images[1].createdBy, sessionId);
        updateVoteCount(1); // Update Player 2's vote count
        console.log('Voted for Player 2');
    });

    // Back to Home button functionality
    document.getElementById('home_button').addEventListener('click', () => {
        window.location.href = '/'; // Redirect to the home page
    });
});

async function voteForPlayer(playerId, sessionId) {
    try {
        const response = await fetch('/vote', {
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
            alert('Vote submitted successfully!');
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
