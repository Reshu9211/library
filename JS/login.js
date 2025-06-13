// Check if users exist in localStorage, if not initialize an empty array
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}

// Simple login validation
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users'));
  
  // Check if user exists and password matches
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    alert("Login successful!");
    // Optional: Store the current user in localStorage or session
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Redirect to another page or do something else
  } else {
    alert("Invalid username or password.");
  }
});

// Simple registration validation
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!username || !password || !confirmPassword) {
    alert("All fields are required.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Get existing users
  const users = JSON.parse(localStorage.getItem('users'));
  
  // Check if username already exists
  const userExists = users.some(u => u.username === username);
  
  if (userExists) {
    alert("Username already taken. Please choose another.");
    return;
  }

  // Add new user
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  
  alert("Registration successful! You can now login.");
  // Optional: Clear the form or redirect to login page
  document.getElementById("registerForm").reset();
});