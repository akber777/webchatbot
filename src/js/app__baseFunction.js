let tenantIDKey;

// script
const scriptTwilio = document.createElement("script");
// twilio
scriptTwilio.src =
  "https://media.twiliocdn.com/sdk/js/conversations/releases/1.0.0/twilio-conversations.min.js";

const scriptSplide = document.createElement("script");
scriptSplide.src =
  "https://cdn.jsdelivr.net/npm/@splidejs/splide@2.4.21/dist/js/splide.min.js";

document.querySelector("head").appendChild(scriptSplide);

function App() {
  const self = {
    start: function (id) {
      if (id != undefined) {
        localStorage.setItem("tenantID", id);
      }

      document.querySelector("head").appendChild(scriptTwilio);
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
    prependCore: function (targetElement, appendElement) {
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
