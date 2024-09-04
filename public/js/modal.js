document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.getElementById('loginModal');
    const openModalButton = document.getElementById('log_in_button');
    const closeModalButtons = modal.querySelectorAll('.modal-close');
    const modalBackground = modal.querySelector('.modal-background');
    const playButton = document.getElementById('play_button');
    const galleryButton = document.getElementById('gallery_button');
    const logoutButton = document.getElementById('logoutButton');

    // Function to update the state of the buttons based on user login status
    function updateButtonVisibility() {
        const user = sessionStorage.getItem('user');
        
        if (user) {
            // Show buttons if the user is logged in
            playButton.style.display = 'inline-block';
            galleryButton.style.display = 'inline-block';
        } else {
            // Hide buttons if the user is not logged in
            playButton.style.display = 'none';
            galleryButton.style.display = 'none';
        }
    }

    // Initial check to set the button visibility on page load
    updateButtonVisibility();

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
                    updateButtonVisibility(); // Show buttons after login
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
                    updateButtonVisibility(); // Show buttons after signup
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

    // Handle logout
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('user/logout', { method: 'POST' });
            if (response.ok) {
                sessionStorage.removeItem('user');
                updateButtonVisibility(); // Hide buttons after logout
                modal.classList.remove('is-active');
            } else {
                alert('Failed to log out.');
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('An error occurred during logout.');
        }
    });

    // Handle "To Battle!" button click
    playButton.addEventListener('click', async () => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            alert('You must be logged in to start a battle!');
            return;
        }

        // Proceed with the original logic if the user is logged in
        try {
            const response = await fetch('/user-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            if (!response.ok) {
                throw new Error('Failed to fetch user information.');
            }
        
            const userData = await response.json();
            sessionStorage.setItem('user', JSON.stringify(userData));
        
            const responseSession = await fetch('/api/game-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.stringify(userData)}` // Send the user object as the token
                }
            });
        
            if (!responseSession.ok) {
                throw new Error('Failed to create game session.');
            }
        
            const data = await responseSession.json();
            const sessionId = data.sessionId;
        
            if (sessionId) {
                window.location.href = `/lobby?session=${sessionId}`; // Redirect to lobby with session parameter
            } else {
                alert('Failed to create a new game session.');
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('An error occurred while creating a new game session.');
        }
    });
});
