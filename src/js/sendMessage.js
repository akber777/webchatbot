const inpVal = document.querySelector(".textInput");

const chatBtn = document.querySelector(".btnChat");

function sendMessages(event) {
  event.preventDefault();

  if (inpVal.value !== "") {
    conversation.sendMessage(inpVal.value, { hidden: true });
  }

  inpVal.value = "";
}

document.querySelector(".sendBtn").addEventListener("click", sendMessages);
