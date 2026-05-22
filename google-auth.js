let tokenClient;

window.onload = function() {
  // Initialize the Google Identity Services Token Client
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: '453096410101-02b5r08l0ier4t972q823niir57ejtd9.apps.googleusercontent.com', 
    scope: 'email profile',
    callback: async (response) => {
      if (response && response.access_token) {
        try {
          // Fetch user info using the access token
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${response.access_token}` }
          });
          const user = await res.json();
          
          // Structure the payload exactly like auth.js expects
          const payload = {
            email: user.email,
            name: user.name,
            photo: user.picture,
            loggedInAt: new Date().toISOString()
          };

          // Save to local storage
          localStorage.setItem("modLivingAuth", JSON.stringify(payload));
          
          // Redirect to main page after successful login
          window.location.href = "main.html";
          
        } catch (error) {
          console.error(error);
          alert("Failed to fetch Google user data.");
        }
      }
    }
  });
};

window.googleLogin = function() {
  if (tokenClient) {
    // Request access token, this pops up the Google Sign-In window
    tokenClient.requestAccessToken();
  } else {
    alert("Google Auth not initialized. Please ensure your Client ID is configured.");
  }
};
