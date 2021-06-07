let tenantIDKey;

// script
const scriptTwilio = document.createElement("script");
// twilio
scriptTwilio.src =
  "https://media.twiliocdn.com/sdk/js/conversations/releases/1.0.0/twilio-conversations.min.js";

// splide js

const scriptSplide = document.createElement("script");
scriptSplide.src =
  "https://cdn.jsdelivr.net/npm/@splidejs/splide@2.4.21/dist/js/splide.min.js";

document.querySelector("head").appendChild(scriptSplide);

// range slider
const scriptRangeSLider = document.createElement("script");
scriptRangeSLider.src =
  "https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/js/ion.rangeSlider.min.js";

document.querySelector("head").appendChild(scriptRangeSLider);

// input mask
// const inputMask = document.createElement("script");
// inputMask.src =
//   "https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.5/jquery.inputmask.min.js";

// document.querySelector("head").appendChild(inputMask);

// ---------AJAX

// request get converstaion params
async function newUser(tenantID) {
  $.ajax({
    type: "POST",
    url: `http://ec2-3-120-103-49.eu-central-1.compute.amazonaws.com:8080/api/public/web/bot/${tenantID}`,
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  }).done(function (data) {
    startChat(data);
  });
}

async function oldUser(tenantId, chatParams) {
  $.ajax({
    type: "POST",
    url: `http://ec2-3-120-103-49.eu-central-1.compute.amazonaws.com:8080/api/public/web/bot`,
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      tenantId: tenantId,
      userIdentity: chatParams,
    }),
  }).done(function (data) {
    startChat(data);
  });
}

function App() {
  const self = {
    start: function (id) {
      document.querySelector("head").appendChild(scriptTwilio);

      if (id != undefined) {
        localStorage.setItem("tenantID", id);
        if (localStorage.getItem("chatParams") == null) {
          newUser(id);
        } else {
          oldUser(
            localStorage.getItem("tenantID"),
            JSON.parse(localStorage.getItem("chatParams")).userIdentity
          );
        }
      }
    },
    checkedUrl: function (url, item) {
      if (url.type == "url") {
        return `<a target="_blank" href=${url.url}>${url.text}</a>`;
      } else if (url.type == "phone") {
        return `<a href=tel:${url.phone}>${url.text}</a>`;
      } else if (url.type == "text") {
        return `<button>
                  ${url.text}                                          
        </button>`;
      } else {
        return "";
      }
    },
    appendHtml: function (targetElement, appendElement) {
      var div = document.createElement("div");
      div.innerHTML = appendElement;
      while (div.children.length > 0) {
        targetElement.appendChild(div.children[0]);
      }
    },
    prependHtml: function (targetElement, appendElement) {
      var div = document.createElement("div");
      const boxFirst = document.getElementsByClassName("app__content--msg")[0];
      div.innerHTML = appendElement;
      while (div.children.length > 0) {
        targetElement.insertBefore(div.children[0], boxFirst);
      }
    },
    addlocalStorage: function (key, items) {
      if (typeof items == "object") {
        localStorage.setItem(key, JSON.stringify(items));
      } else if (typeof items == "string") {
        localStorage.setItem(key, items);
      }
    },
  };

  return self;
}

const webchat = new App();
