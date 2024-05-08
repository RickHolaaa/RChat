const socket = io();

const listUsers = document.getElementById("users");
const form = document.getElementById("message-form");
const prefix = 'User';

function createUser(prefix = 'User') {
    return prefix + Math.floor(Math.random() * 100000);
}

function addBox(user) {
    if (document.querySelector(`.${user}-list`)) {
        return;
    }
    listUsers.innerHTML += `<li class="${user}-list">${user}</li>`;
}

const newUser = createUser();

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const message = document.getElementById("message-input");
    socket.emit("chat message", {msg: message.value, user: newUser});
    message.value = "";
});

function updateScroll(){
    const messages = document.getElementById('chat');
    messages.scrollTop = messages.scrollHeight;
    console.log(messages.scrollTop, messages.scrollHeight);
}

socket.emit("user connect", newUser);

socket.on("new user", function (users) {
    console.log("Hello from Client");
    users.map(user => {
        addBox(user);
    });
});

socket.on("chat message", function (data) {
    console.log(`Client chat message: user ${data.user} says ${data.msg}`);
    const chat = document.getElementById("messages");
    if (data.user == newUser) {
        chat.innerHTML += `
        <div class="message" style="text-align: right; background-color: rgb(73, 91, 255); color: white;">
            <strong>Me</strong>
            <p style="text-align: right; background-color: rgb(73, 91, 255); color: white;">${data.msg}</p>
        </div>`;
        updateScroll();
        return;
    }
    chat.innerHTML += `
    <div class="message">
        <strong>${data.user == newUser ? "Me" : data.user}</strong>
        <p>${data.msg}</p>
    </div>`;
    updateScroll();
});

socket.on("user disconnect", function (user) {
    console.log("Client disconnected from Server");
    document.querySelector(`.${user}-list`).remove();
});