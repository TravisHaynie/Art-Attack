// utils/helpers.js

// A helper to format a date to a readable string
const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  // A helper to check if a user is logged in
  const ifLoggedIn = (loggedIn, options) => {
    if (loggedIn) {
      return options.fn(this); // Render block if logged in
    } else {
      return options.inverse(this); // Render else block if not logged in
    }
  };
  
  // A helper to check if a value is equal to another value
  const equals = (a, b, options) => {
    if (a === b) {
      return options.fn(this); // Render block if equal
    } else {
      return options.inverse(this); // Render else block if not equal
    }
  };
  
  // A helper to capitalize the first letter of a string
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  // Export the helpers
  module.exports = {
    formatDate,
    ifLoggedIn,
    equals,
    capitalize
  };
  