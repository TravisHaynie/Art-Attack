const loginFormHandler = async (event, player) => {
  event.preventDefault();

  // Get form values based on the player
  const name = document.querySelector(`#name-login-${player}`).value.trim();  // Updated to 'name'
  const username = document.querySelector(`#username-login-${player}`).value.trim();
  const password = document.querySelector(`#password-login-${player}`).value.trim();

  if (name && username && password) {
      const response = await fetch(`/api/users/login-${player}`, {
          method: 'POST',
          body: JSON.stringify({ name, username, password }),  // Updated to include 'name'
          headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
          document.location.replace('/');
      } else {
          alert(`Failed to log in Player ${player}.`);
      }
  }
};

const logout = async () => {
  const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
      document.location.replace('/');
  } else {
      alert('Failed to log out.');
  }
};

// Attach event listeners to both login forms
document.querySelector('#login-form-player1').addEventListener('submit', (event) => loginFormHandler(event, 'player1'));
document.querySelector('#login-form-player2').addEventListener('submit', (event) => loginFormHandler(event, 'player2'));

document.querySelector('#logout').addEventListener('click', logout);
