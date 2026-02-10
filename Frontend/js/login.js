document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // store token for later authenticated requests
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        alert("Login successful");
        window.location.href = "index.html";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    }
  });
