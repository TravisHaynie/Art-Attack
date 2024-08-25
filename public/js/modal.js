document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openModalButton = document.getElementById('log_in_button');
    const closeModalButtons = modal.querySelectorAll('.modal-close');
    const modalBackground = modal.querySelector('.modal-background');
    const playButton = document.getElementById('play_button');
    const logoutButton = document.getElementById('logoutButton');

    // Open modal when login button is clicked
    openModalButton.addEventListener('click', () => {
        modal.classList.add('is-active');
    });

    // Close modal when the close button or background is clicked
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('is-active');
        });
    });

    modalBackground.addEventListener('click', () => {
        modal.classList.remove('is-active');
    });

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username-login').value.trim();
        const password = document.getElementById('password-login').value.trim();

        if (username && password) {
            try {
                const response = await fetch('/user/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    updatePlayButtonState(); // Update button state after login
                    modal.classList.remove('is-active');
                    console.log(data);
                } else {
                    alert('Failed to log in.');
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('An error occurred during login.');
            }
        }
    });

    // Handle signup form submission
    document.getElementById('signupForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username-signup').value.trim();
        const email = document.getElementById('email-signup').value.trim();
        const password = document.getElementById('password-signup').value.trim();

        if (username && email && password) {
            try {
                const response = await fetch('/user', {
                    method: 'POST',
                    body: JSON.stringify({ username, email, password }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    sessionStorage.setItem('user', JSON.stringify(data));
                    updatePlayButtonState(); // Update button state after signup
                    modal.classList.remove('is-active');
                } else {
                    alert('Failed to sign up.');
                }
            } catch (err) {
                console.error('Signup error:', err);
                alert('An error occurred during signup.');
            }
        }
    });

    // Toggle between login and signup forms
    document.getElementById('showSignupForm').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('signupFormContainer').style.display = 'block';
    });

    document.getElementById('showLoginForm').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('loginFormContainer').style.display = 'block';
        document.getElementById('signupFormContainer').style.display = 'none';
    });

    // Function to update the state of the "To Battle!" button based on user login status
    function updatePlayButtonState() {
        const user = sessionStorage.getItem('user');
        playButton.disabled = !user;
    }

    // Initial check to set the button state on page load
    updatePlayButtonState();

    // Handle "To Battle!" button click
    playButton.addEventListener('click', async () => {
        const user = sessionStorage.getItem('user');

        if (!user) {
            alert('You must be logged in to access the battle.');
            return;
        }

        try {
            // Create a new game session
            const response = await fetch('/game-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to create game session.');
            }

            const data = await response.json();
            const sessionId = data.sessionId; // Assuming the response contains the session ID

            if (sessionId) {
                // Redirect to the lobby page with the new session ID
                window.location.href = `/lobby?sessionId=${sessionId}`;
            } else {
                alert('Failed to create a new game session.');
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('An error occurred while creating a new game session.');
        }
    });

    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('user/logout', { method: 'POST' });
            if (response.ok) {
                sessionStorage.removeItem('user');
                updatePlayButtonState(); // Update button state after logout
                modal.classList.remove('is-active'); // Optionally close the modal on logout
                alert('You have been logged out.');
            } else {
                alert('Failed to log out.');
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('An error occurred during logout.');
        }
    });
    const joinCurrentSessionButton = document.getElementById('join_current_session_button');

    joinCurrentSessionButton.addEventListener('click', async () => {
        const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        alert('You must be logged in to join a game session.');
        return;
    }

    try {
        // Fetch the current active session ID
        const response = await fetch('/current-session');

        if (!response.ok) {
            throw new Error('Failed to fetch current session.');
        }

        const data = await response.json();
        const sessionId = data.sessionId;

        if (sessionId) {
            // Attempt to join the session
            const joinResponse = await fetch('/join-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    userId: user.id
                })
            });

            if (joinResponse.ok) {
                alert('Successfully joined the game session!');
                window.location.href = `/game-session.html?sessionId=${sessionId}`;
            } else {
                const errorData = await joinResponse.json();
                alert(`Failed to join session: ${errorData.message}`);
            }
        } else {
            alert('No active session found.');
        }
    } catch (error) {
        console.error('Error fetching or joining session:', error);
        alert('An error occurred while joining the game session.');
    }
});

    document.getElementById('submitBtn').addEventListener('click', async () => {
        const subject = document.getElementById('subjectInput').value.trim();
        const user = JSON.parse(sessionStorage.getItem('user'));
    
        // Check if user is logged in
        if (!user) {
            alert('You must be logged in to submit a subject suggestion.');
            return;
        }
    
        // Check if the subject input is not empty
        if (!subject) {
            alert('Please enter a subject.');
            return;
        }
    
        try {
            const response = await fetch('/suggestSubject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: subject,
                    submittedBy: user.id // Ensure you are sending the user ID
                })
            });
    
            if (response.ok) {
                alert('Subject suggestion submitted successfully!');
                // Optionally, you can clear the input field or update the UI
                document.getElementById('subjectInput').value = '';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting subject suggestion:', error);
            alert('An error occurred while submitting the subject.');
        }
    });
});