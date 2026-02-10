document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPasswordValue = document.getElementById(
      "confirmPasswordInput"
    ).value;
    const confirmPasswordMsg = document.getElementById("confirmPassword");

    if (password !== confirmPasswordValue) {
      confirmPasswordMsg.innerText = "Passwords do not match";
      return;
    } else {
      confirmPasswordMsg.innerText = "";
    }

    let user = {
      name,
      mobile,
      email,
      password,
    };

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      // if (res.ok) {
      //   alert("Signup successful! Please login.");
      //   window.location.href = "login.html";
      // } else {
      //   alert(data.error || "Signup failed");
      // }

      if (res.ok) {
  successMsg.innerHTML = "✅ Signup successful! Redirecting to login...";
  
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}else{
 successMsg.innerHTML="Signup failed"
}
    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    }
  });
