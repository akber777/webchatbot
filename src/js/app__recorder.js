//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia()
var rec;
//Recorder.js object
var input;

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var removeButton = document.getElementById("removeRecord");

var recTime = 0;

var recInterval;

var globalAudioId;

const form = new FormData();

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
removeButton.addEventListener("click", removeRecording);

function startRecording() {
  form.delete("voice");
  $(".fileInput,.fileInputSvg").hide();
  $(".fileInput,.fileInputSvg").removeClass("showFileInput");
  $("#recordButton").hide();
  $("#recordStart").show();
  $("#removeRecord").show();
  $(".textInput").hide();
  $("#stopButton").show();

  recTime = 0;

  recInterval = setInterval(() => {
    recTime++;
  }, 1000);

  var constraints = {
    audio: true,
    video: false,
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      gumStream = stream;
      input = audioContext.createMediaStreamSource(stream);

      rec = new Recorder(input, {
        numChannels: 1,
      });

      rec.record();
    })
    .catch(function (err) {});
}

function stopRecording() {
  $(".sendBtn").show();
  $("#recordButton").hide();
  $("#stopButton").hide();
  $("#removeRecord").addClass("removeRecordSvg");
  $(".sendBtn ").removeClass("disabledSend");
  clearInterval(recInterval, 1);

  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);

  let audioId =
    "app" + new Date().getMilliseconds().toLocaleString().replaceAll(" ", "");

  globalAudioId = audioId;

  let audioHtml = `<div id=${audioId} class='audioAppBoxBot audioAppBoxBotRecorder'>
    <audio>
        <source src=${url} type="audio/wav">
    </audio>
    </div>`;

  $("#multifghjx input").hide();
  $("#multifghjx").append(audioHtml);

  new GreenAudioPlayer("#" + audioId);

  form.append("voice", blob, ".wav");
}

function removeRecording() {
  rec.stop();
  gumStream.getAudioTracks()[0].stop();
  $("#multifghjx")
    .find("#" + globalAudioId)
    .remove();

  $("#multifghjx input").show();
  $("#recordButton").show();
  $("#removeRecord").hide();
  $(".sendVoice").hide();
  $("#stopButton").hide();
  $(".fileInput").show();
  $(".fileInputSvg").show();
  form.delete("voice");
}

function sendMessagesVoice(event) {
  event.preventDefault();

  if (form.getAll("voice")[0] !== undefined) {
    conversation.sendMessage(form);
    $("#multifghjx")
      .find("#" + globalAudioId)
      .remove();
    $("#multifghjx input").show();
    $("#recordButton").show();
    $("#removeRecord").hide();
    $(".sendVoice").hide();
    $("#stopButton").hide();
    $(".fileInput").addClass("showFileInput");
    $(".fileInputSvg").addClass("showFileInput");
  }
}

document.querySelector(".sendBtn").addEventListener("click", sendMessagesVoice);
