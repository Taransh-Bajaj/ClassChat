// Auto-login if data exists
if (localStorage.getItem("username")) {
    window.location.href = "chat.html";
}

function join() {
    const user = document.getElementById("username").value.trim();
    const gen = document.getElementById("gender").value;

    if (!user || !gen) {
        alert("Please fill in all fields");
        return;
    }

    localStorage.setItem("username", user);
    localStorage.setItem("gender", gen);
    window.location.href = "chat.html";
}