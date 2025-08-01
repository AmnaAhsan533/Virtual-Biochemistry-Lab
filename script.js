
function goToLogin() {
  window.location.href = "login.html";
}

var x = document.getElementById("login");
        var y = document.getElementById("register");
        var z = document.getElementById("btn");

        function register() {
            x.style.left = "-400px";
            y.style.left = "50px";
            z.style.left = "110px";
        }

        function login() {
            x.style.left = "50px";
            y.style.left = "450px";
            z.style.left = "0";
        }

        function validateLogin() {
    // Get user input values
    var userId = document.getElementById("loginUserId").value.trim();
    var password = document.getElementById("loginPassword").value.trim();

    // Retrieve user data from localStorage
    var storedUser = JSON.parse(localStorage.getItem(userId));

    if (storedUser && storedUser.password === password) {
        // Save logged-in user session
        localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
        
        // Redirect to todo-list page
        window.location.href = "todo.html";
        return false; // Prevent form submission
    } else {
        alert("Invalid User ID or Password!");
        return false; // Prevent form submission
    }
}


function validateRegister() {
    const userId = document.getElementById("registerUserId").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const terms = document.getElementById("registerTerms").checked;

    if (!userId || !password || !email) {
        alert("All fields are required.");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (!terms) {
        alert("You must agree to the terms and conditions.");
        return false;
    }

    // Check if user already exists
    if (localStorage.getItem(userId)) {
        alert("User ID already exists. Please choose a different one.");
        return false;
    }

    // Save user data to localStorage
    const userData = { userId, password, email };
    localStorage.setItem(userId, JSON.stringify(userData));

    alert("Registration successful! You can now log in.");
    login(); // Switch to the login form
    return false; // Prevent form submission
}

function continueAsGuest() {
  localStorage.setItem("isLoggedIn", false);
  window.location.href = "lab.html";
}