const inpVal = document.querySelector(".textInput");

const chatBtn = document.querySelector(".btnChat");

$(".sendBtn").addClass("disabledSend");

inpVal.onkeyup = function (e) {
  if (e.target.value == "") {
    $(".sendBtn").addClass("disabledSend");
    $(".sendBtn").hide();
    $(".voiceBtn").show();
  } else {
    $(".sendBtn").removeClass("disabledSend");
    $(".sendBtn").show();
    $(".voiceBtn").hide();
  }
};

function sendMessages(event) {
  event.preventDefault();

  if (inpVal.value !== "") {
    conversation.sendMessage(inpVal.value);
  }

  inpVal.value = "";

  if (inpVal.value == "") {
    $(".sendBtn").hide();
    $(".fileInput").hide();
    $(".fileInputSvg").hide();
    $(".voiceBtn").show();
  }
}

document.querySelector(".sendBtn").addEventListener("click", sendMessages);
