console.log("test");
const messageBoardContainer = document.getElementById("messageBoardContainer");
const form = document.getElementById("messageForm");

const submitSound1 = new Audio("client/sounds/trap.mp3");
const submitSound2 = new Audio("client/sounds/hello.mp3");
const likeSound1 = new Audio("client/sounds/good.mp3");
const likeSound2 = new Audio("client/sounds/doit.mp3");
const deleteSound = new Audio("client/sounds/faith.mp3");

let useFirstSubmitSound = true;
let useFirstLikeSound = true;

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
      if (useFirstLikeSound) {
        likeSound1.play();
      } else {
        likeSound2.play();
      }
      useFirstLikeSound = !useFirstLikeSound;
    });
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteBtn");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", function () {
      handleDelete(message.id);
      deleteSound.play();
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
  if (useFirstSubmitSound) {
    submitSound1.play();
  } else {
    submitSound2.play();
  }
  useFirstSubmitSound = !useFirstSubmitSound;
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
