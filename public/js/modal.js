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
                const response = await fetch('/user', {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    updatePlayButtonState(); // Update button state after login
                    modal.classList.remove('is-active');
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
        if (user) {
            playButton.disabled = false;
        } else {
            playButton.disabled = true;
        }
    }

    // Initial check to set the button state on page load
    updatePlayButtonState();

    // Handle "To Battle!" button click
    playButton.addEventListener('click', () => {
        const user = sessionStorage.getItem('user');
        if (user) {
            window.location.href = '/canvas'; 
        } else {
            alert('You must be logged in to access the battle.');
        }
    });

    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('user');
        updatePlayButtonState(); // Update button state after logout
        modal.classList.remove('is-active'); // Optionally close the modal on logout
        alert('You have been logged out.');
    });
    
});
