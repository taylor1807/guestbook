console.log("test");
const messageBoardContainer = document.getElementById("messageBoardContainer");
const form = document.getElementById("messageForm");

async function getMessages() {
  const response = await fetch(
    "https://guestbook-server-xa3l.onrender.com/messages"
  );
  const data = await response.json();
  console.log(data);
  messageBoardContainer.innerHTML = "";
  data.forEach(function (message) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("messageContainer");
    const messageInsert = document.createElement("p");
    messageInsert.textContent = `${message.name} wrote: ${message.message}`;
    const likeCount = document.createElement("span");
    likeCount.textContent = `Likes: ${message.likes || 0}`;
    const likeButton = document.createElement("button");
    likeButton.classList.add("likeBtn");
    likeButton.textContent = "Like";
    likeButton.addEventListener("click", function () {
      handleLike(message.id);
    });
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", function () {
      handleDelete(message.id);
    });
    messageContainer.appendChild(messageInsert);
    messageContainer.appendChild(likeCount);
    messageContainer.appendChild(likeButton);
    messageContainer.appendChild(deleteButton);
    messageBoardContainer.appendChild(messageContainer);
  });
}

getMessages();

async function handlePostMessage(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  await fetch("https://guestbook-server-xa3l.onrender.com/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  form.reset();
  getMessages();
}
async function handleLike(messageId) {
  const response = await fetch(
    `https://guestbook-server-xa3l.onrender.com/messages/${messageId}/like`,
    {
      method: "POST",
    }
  );
  getMessages();
}
async function handleDelete(messageId) {
  const response = await fetch(
    `https://guestbook-server-xa3l.onrender.com/messages/${messageId}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    getMessages();
  }
}
form.addEventListener("submit", handlePostMessage);
getMessages();
