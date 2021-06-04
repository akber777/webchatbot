const storage = localStorage.getItem("tenantID");

const chatContentBox = document.querySelector(".app__content");

let msg = [];

let multipleSelection = [];

let conversation;

let pagination = [];

let sliderTitle;

let loadingBtn = false;

const chatParams = {
  conversationSid: "CHd45c05c39d7247e5bbf3dddaa6678fc4",
  userIdentity: "web:d0c38191-1678-456e-a401-4a39aab9d645",
  twilioToken:
    "eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJTS2Q4Y2U1NzEwNWE5ODk2ZTc4ODQ1YzljY2FjZmQ5ZDlmIiwiZXhwIjoxNjIyODUyNTc4LCJncmFudHMiOnsiaWRlbnRpdHkiOiJ3ZWI6ZDBjMzgxOTEtMTY3OC00NTZlLWE0MDEtNGEzOWFhYjlkNjQ1IiwiY2hhdCI6eyJzZXJ2aWNlX3NpZCI6IklTY2NjY2MxYzY5MjBmNGQ4YWJkZmZmMWNiNzczZjVmZTcifX0sImp0aSI6IlNLZDhjZTU3MTA1YTk4OTZlNzg4NDVjOWNjYWNmZDlkOWYtMTYyMjgwOTM0NCIsInN1YiI6IkFDN2I2MjhjNDVjNTk4OTRjODViMjk4MDBhNGU4ZmZiYWQifQ.1yZ7jalUCpcEQigXXed-4-M4Fmz3yfmc66QiBZ9wYrM",
  flowSid: "FW76c37121aa15eb90c299a813c6035fe8",
};

webchat.addlocalStorage("chatParams", chatParams);

function startChat() {
  window.onload = (event) => {
    Twilio.Conversations.Client.create(chatParams.twilioToken).then(
      (twilioClient) => {
        // Conversation Sid-e göre conversation melumatlarini twiliodan alir.
        twilioClient
          .getConversationBySid(chatParams.conversationSid)
          .then((channel) => {
            conversation = channel;
            // Conversationda olan butun mesajlari getirir
            conversation.getMessages(10).then((messages) => {
              pagination.push(messages);

              msg.push(...messages.items);

              msg.forEach((item) => {
                if (item.author === chatParams.conversationSid) {
                  // Botdan gelen  Message = ConversationSid

                  if (JSON.parse(item.body).type == "text") {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                  <div class="app__content--msg bot">
                  <div class='in'>
                    ${JSON.parse(item.body).body.text}
                  </div>
                  </div>
                `
                    );


                    console.log(JSON.parse(item.body))
                      
                  }

                  // image
                  else if (JSON.parse(item.body).type == "image") {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                          <div class='app__sliderBox app__imageContainer'>
                            <img src=${JSON.parse(item.body).body.url} />
                          <div class="app__sliderBox--info">
                            <p>${JSON.parse(item.body).body.text}</p>
                            <a target="_blank" href=${
                              JSON.parse(item.body).body.url
                            }>
                              ${JSON.parse(item.body).body.url}
                            </a>
                            ${JSON.parse(item.body)
                              .body.buttons.map(
                                (btnBox) =>
                                  `
                                <div class="app__sliderBox--buttons imageBoxContainer">
                                  ${webchat.checkedUrl(btnBox)}
                                </div>
                                `
                              )
                              .join(" ")}
                          </div>
                          </div>
                      `
                    );

                    $(".imageBoxContainer button").on("click", function () {
                      conversation.sendMessage($(this).text().trim());
                    });
                  }

                  // video
                  else if (JSON.parse(item.body).type == "video") {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                          <div class='app__sliderBox app__videoBox'>
                          <iframe
                              src=https://www.youtube.com/embed/${
                                JSON.parse(item.body).body.url.split("?v=")[1]
                              }>
                              </iframe>
                          <div class="app__sliderBox--info">
                            <p>${JSON.parse(item.body).body.text}</p>
                            <a target="_blank" href=${
                              JSON.parse(item.body).body.url
                            }>
                              ${JSON.parse(item.body).body.url}
                            </a>
                            ${JSON.parse(item.body)
                              .body.buttons.map(
                                (btnBox) =>
                                  `
                                <div class="app__sliderBox--buttons videoBoxContainer">
                                  ${webchat.checkedUrl(btnBox)}
                                </div>
                                `
                              )
                              .join(" ")}
                          </div>
                          </div>

                      `
                    );

                    $(".videoBoxContainer button").on("click", function () {
                      conversation.sendMessage($(this).text().trim());
                    });
                  }
                  // multiple selection
                  else if (JSON.parse(item.body).type == "multipleSelection") {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                      <div  class="app__content--msg bot multipleSelection">
                        <div class='in'>
                          <div class="app__multipleTitle">
                          ${JSON.parse(item.body).body.text}
                          </div>
                          <div class="app__multipleItems">
                            ${JSON.parse(item.body)
                              .body.options.map(
                                (item) => `<div>
                                <label for=${item}>
                                <input id=${item} type="checkbox" />
                                ${item}
                                </label>
                              </div>`
                              )
                              .join("")}
                          </div>
                          <div class="app__multipleConfirm">
                                <button>
                                  Confirm
                                </button>
                          </div>
                        </div>

                      </div>
                      `
                    );

                    $(".app__multipleItems label").on("click", function () {
                      if ($(this).find("input").is(":checked") === true) {
                        if (
                          multipleSelection.includes($(this).text().trim()) ===
                          false
                        ) {
                          multipleSelection.push($(this).text().trim());
                        }
                      } else {
                        multipleSelection = multipleSelection.filter(
                          (e) => e !== $(this).text().trim()
                        );
                      }
                    });

                    $(".app__multipleConfirm button").on("click", function () {
                      if (multipleSelection.length !== 0) {
                        conversation.sendMessage(multipleSelection.toString());
                      }
                    });
                  }

                  // slider
                  else if (JSON.parse(item.body).type == "carousel") {
                    webchat.appendHtml(
                      chatContentBox,
                      `<div class="app__content--msg bot carouselChat">
                        <div class='in'>
                          <div class="app__content--buttons">
                          <div class="splide splideCarousel">
                              <div class="splide__track">
                                <ul class="splide__list">
                                 ${JSON.parse(item.body)
                                   .body.pages.map(
                                     (item) =>
                                       `<li class="splide__slide">
                                        
                                          <div class='app__sliderBox'>
                                            <img src=${item.imageUrl} />
                                             <div class="app__sliderBox--info">
                                              <h4>${item.title}</h4>
                                              <p>${item.subtitle}</p>
                                              ${item.buttons
                                                .map(
                                                  (btnBox) =>
                                                    `
                                                  <div class="app__sliderBox--buttons">
                                                    ${btnBox
                                                      .map((btnIn) =>
                                                        webchat.checkedUrl(
                                                          btnIn
                                                        )
                                                      )
                                                      .join("")}
                                                  </div>
                                                  `
                                                )
                                                .join(" ")}
                                             </div>
                                          </div>
                                       </li>`
                                   )
                                   .join(" ")}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    `
                    );

                    var elms =
                      document.getElementsByClassName("splideCarousel");

                    for (var i = 0, len = elms.length; i < len; i++) {
                      new Splide(elms[i], {
                        type: "loop",
                        pagination: false,
                        gap: "0.5rem",
                        padding: {
                          right: 20,
                        },
                      }).mount();
                    }

                    $(".app__sliderBox--buttons button").on(
                      "click",
                      function () {
                        conversation.sendMessage(
                          $(this)
                            .parents(".app__sliderBox--info")
                            .find("h4")
                            .text() +
                            " : " +
                            $(this).text().trim(),
                          {
                            type: "button",
                            text: $(this).text().trim(),
                          }
                        );
                      }
                    );
                  }

                  // text and buttons
                  else if (JSON.parse(item.body).type == "textAndButtons") {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                      <div class="app__content--msg bot">
                        <div class='in'>
                        <div class="app__content--buttons">
                          <p>${JSON.parse(item.body).body.text}</p>
                        </div>
                        </div>
                      </div>
                `
                    );

                    JSON.parse(item.body).body.buttons.forEach((item, index) =>
                      webchat.appendHtml(
                        chatContentBox,
                        `<div class="app__content--msg bot buttons">
                          <div class="in">
                         ${
                           item.length !== undefined
                             ? item
                                 .map(
                                   (btn) =>
                                     `<button class='btnChat'>${btn.text}</button>`
                                 )
                                 .join("")
                             : ``
                         }
                          </div>
                        </div>`
                      )
                    );

                    $(".btnChat").on("click", function () {
                      conversation.sendMessage($(this).text(), {
                        type: "btn",
                      });

                      btnClick = true;
                    });
                  }

                  //phone
                  else if (JSON.parse(item.body).type == "phone") {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                      <div class="app__content--msg bot tel">
                      <div class='in'>
                        <div class='app__content--msg__input'>
                          <span class='telPlaceHoldder'>Type your number</span>
                          <input type='text' class='app__telInput' />
                          <button class='sendInpValue'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2929 6.29289C11.9024 6.68342 11.9024 7.31658 12.2929 7.70711L15.5858 11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H15.5858L12.2929 16.2929C11.9024 16.6834 11.9024 17.3166 12.2929 17.7071C12.6834 18.0976 13.3166 18.0976 13.7071 17.7071L18.7065 12.7077C18.7067 12.7075 18.7069 12.7073 18.7071 12.7071C18.7432 12.6816 18.7749 12.644 18.8021 12.5973C18.9264 12.4306 19 12.2239 19 12C19 11.7761 18.9264 11.5694 18.8021 11.4027C18.7749 11.356 18.7432 11.3184 18.7071 11.2929C18.7069 11.2927 18.7067 11.2925 18.7065 11.2923L13.7071 6.29289C13.3166 5.90237 12.6834 5.90237 12.2929 6.29289Z" fill="#1089FF"/>
                            </svg>                    
                          </button>
                        </div>
                      </div>
                      </div>
                      `
                    );

                    $(".telPlaceHoldder").on("click", function () {
                      $(this).toggleClass("animateTel");
                    });

                    $(".app__telInput").keypress(function (e) {
                      $(this).keyup(function (e) {
                        if ($(this).val() !== "") {
                          $(".app__btnBox").hide();
                          $(this).addClass("activeVal");
                        } else {
                          $(".app__btnBox").show();
                          $(this).removeClass("activeVal");
                        }
                      });

                      if (
                        e.which != 8 &&
                        e.which != 0 &&
                        (e.which < 48 || e.which > 57)
                      ) {
                        return false;
                      }
                    });

                    $(".sendInpValue").on("click", function () {
                      if ($(this).prev().val() !== "") {
                        conversation.sendMessage($(this).prev().val());
                      }

                      $(this).prev().val("");
                      $(".app__btnBox").show();
                    });
                  }
                } else if (item.author === chatParams.userIdentity) {
                  if (item.attributes.type == "button") {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                    <div class="app__content--msg user newMessages">
                    <div class='in'>
                      ${item.attributes.text}
                      </div>
                    </div>
                  `
                    );
                  } else {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                    <div class="app__content--msg user newMessages">
                    <div class='in'>
                      ${item.body}
                      </div>
                    </div>
                  `
                    );
                  }
                } else {
                  webchat.appendHtml(
                    chatContentBox,
                    `
              <div class="app__content--msg bot">
                <div class='in'>
                  ${item.body}
                </div>
              </div>
            `
                  );
                }

                chatContentBox.scrollTo({
                  behavior: "smooth",
                  top: chatContentBox.scrollHeight + 500,
                });
              });

              // messages
            });
            twilioClient.on("conversationJoined", (joinedConversation) => {
              conversation = joinedConversation;
            });
            twilioClient.on("messageAdded", (item) => {
              if (item.author === chatParams.conversationSid) {
                // Botdan gelen  Message = ConversationSid
                if (JSON.parse(item.body).type == "text") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                <div class="app__content--msg bot newMessages">
                <div class='in'>
                  ${JSON.parse(item.body).body.text}
                </div>
                </div>
              `
                  );
                }

                // image
                else if (JSON.parse(item.body).type == "image") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                          <div class='app__sliderBox app__imageContainer'>
                            <img src=${JSON.parse(item.body).body.url} />
                          <div class="app__sliderBox--info">
                            <p>${JSON.parse(item.body).body.text}</p>
                            <a target="_blank" href=${
                              JSON.parse(item.body).body.url
                            }>
                              ${JSON.parse(item.body).body.url}
                            </a>
                            ${JSON.parse(item.body)
                              .body.buttons.map(
                                (btnBox) =>
                                  `
                                <div class="app__sliderBox--buttons imageBoxContainer">
                                  ${webchat.checkedUrl(btnBox)}
                                </div>
                                `
                              )
                              .join(" ")}
                          </div>
                          </div>
                      `
                  );

                  $(".imageBoxContainer button").on("click", function () {
                    conversation.sendMessage($(this).text().trim());
                  });
                }

                // video
                else if (JSON.parse(item.body).type == "video") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                        <div class='app__sliderBox app__videoBox'>
                        <iframe
                            src=https://www.youtube.com/embed/${
                              JSON.parse(item.body).body.url.split("?v=")[1]
                            }>
                            </iframe>
                        <div class="app__sliderBox--info">
                          <p>${JSON.parse(item.body).body.text}</p>
                          <a target="_blank" href=${
                            JSON.parse(item.body).body.url
                          }>
                            ${JSON.parse(item.body).body.url}
                          </a>
                          ${JSON.parse(item.body)
                            .body.buttons.map(
                              (btnBox) =>
                                `
                              <div class="app__sliderBox--buttons videoBoxContainer">
                                ${webchat.checkedUrl(btnBox)}
                              </div>
                              `
                            )
                            .join(" ")}
                        </div>
                        </div>

                    `
                  );

                  $(".videoBoxContainer button").on("click", function () {
                    conversation.sendMessage($(this).text().trim());
                  });
                }

                // multiple selection
                else if (JSON.parse(item.body).type == "multipleSelection") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                    <div  class="app__content--msg bot multipleSelection">
                      <div class='in'>
                        <div class="app__multipleTitle">
                        ${JSON.parse(item.body).body.text}
                        </div>
                        <div class="app__multipleItems">
                          ${JSON.parse(item.body)
                            .body.options.map(
                              (item) => `<div>
                              <label for=${item}>
                              <input id=${item} type="checkbox" />
                              ${item}
                              </label>
                            </div>`
                            )
                            .join("")}
                        </div>
                        <div class="app__multipleConfirm">
                              <button>
                                Confirm
                              </button>
                        </div>
                      </div>

                    </div>
                    `
                  );

                  $(".app__multipleItems label").on("click", function () {
                    if ($(this).find("input").is(":checked") === true) {
                      if (
                        multipleSelection.includes($(this).text().trim()) ===
                        false
                      ) {
                        multipleSelection.push($(this).text().trim());
                      }
                    } else {
                      multipleSelection = multipleSelection.filter(
                        (e) => e !== $(this).text().trim()
                      );
                    }
                  });

                  $(".app__multipleConfirm button").on("click", function () {
                    if (multipleSelection.length !== 0) {
                      conversation.sendMessage(multipleSelection.toString());
                    }
                  });
                } else if (JSON.parse(item.body).type == "carousel") {
                  webchat.appendHtml(
                    chatContentBox,
                    `<div class="app__content--msg bot carouselChat">
                      <div class='in'>
                        <div class="app__content--buttons">
                        <div class="splide splideCarousel">
                            <div class="splide__track">
                              <ul class="splide__list">
                               ${JSON.parse(item.body)
                                 .body.pages.map(
                                   (item) =>
                                     `<li class="splide__slide">
                                        <div class='app__sliderBox'>
                                          <img src=${item.imageUrl} />
                                           <div class="app__sliderBox--info">
                                            <h4>${item.title}</h4>
                                            <p>${item.subtitle}</p>
                                            ${item.buttons
                                              .map(
                                                (btnBox) =>
                                                  `
                                                <div class="app__sliderBox--buttons">
                                                  ${btnBox
                                                    .map((btnIn) =>
                                                      webchat.checkedUrl(btnIn)
                                                    )
                                                    .join("")}
                                                </div>
                                                `
                                              )
                                              .join(" ")}
                                           </div>
                                        </div>
                                     </li>`
                                 )
                                 .join(" ")}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  `
                  );

                  var elms = document.getElementsByClassName("splideCarousel");

                  for (var i = 0, len = elms.length; i < len; i++) {
                    new Splide(elms[i], {
                      type: "loop",
                      pagination: false,
                      gap: "0.5rem",
                      padding: {
                        right: 20,
                      },
                    }).mount();
                  }

                  $(".app__sliderBox--buttons button").on("click", function () {
                    conversation.sendMessage(
                      $(this)
                        .parents(".app__sliderBox--info")
                        .find("h4")
                        .text() +
                        " : " +
                        $(this).text().trim(),
                      {
                        type: "button",
                        text: $(this).text().trim(),
                      }
                    );
                  });
                }

                // text and buttons
                else if (JSON.parse(item.body).type == "textAndButtons") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                      <div class="app__content--msg bot">
                        <div class='in'>
                        <div class="app__content--buttons">
                          <p>${JSON.parse(item.body).body.text}</p>
                        </div>
                        </div>
                      </div>
                `
                  );

                  JSON.parse(item.body).body.buttons.forEach((item, index) =>
                    webchat.appendHtml(
                      chatContentBox,
                      `<div class="app__content--msg bot buttons">
                      <div class="in">
                     ${
                       item.length !== undefined
                         ? item
                             .map(
                               (btn) =>
                                 `<button class='btnChat'>${btn.text}</button>`
                             )
                             .join("")
                         : ``
                     }
                      </div>
                    </div>`
                    )
                  );

                  $(".btnChat").on("click", function () {
                    conversation.sendMessage($(this).text(), { type: "btn" });
                  });
                }

                // phone input
                else if (JSON.parse(item.body).type == "phone") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                <div class="app__content--msg bot tel">
                <div class='in'>
                  <div class='app__content--msg__input'>
                    <span class='telPlaceHoldder'>Type your number</span>
                    <input type='text' class='app__telInput' />
                    <button class='sendInpValue'>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2929 6.29289C11.9024 6.68342 11.9024 7.31658 12.2929 7.70711L15.5858 11H6C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H15.5858L12.2929 16.2929C11.9024 16.6834 11.9024 17.3166 12.2929 17.7071C12.6834 18.0976 13.3166 18.0976 13.7071 17.7071L18.7065 12.7077C18.7067 12.7075 18.7069 12.7073 18.7071 12.7071C18.7432 12.6816 18.7749 12.644 18.8021 12.5973C18.9264 12.4306 19 12.2239 19 12C19 11.7761 18.9264 11.5694 18.8021 11.4027C18.7749 11.356 18.7432 11.3184 18.7071 11.2929C18.7069 11.2927 18.7067 11.2925 18.7065 11.2923L13.7071 6.29289C13.3166 5.90237 12.6834 5.90237 12.2929 6.29289Z" fill="#1089FF"/>
                      </svg>                    
                    </button>
                  </div>
                </div>
                </div>
              `
                  );

                  $(".telPlaceHoldder").on("click", function () {
                    $(this).toggleClass("animateTel");
                  });

                  $(".app__telInput").keypress(function (e) {
                    $(this).keyup(function (e) {
                      if ($(this).val() !== "") {
                        $(".app__btnBox").hide();
                      } else {
                        $(".app__btnBox").show();
                      }
                    });

                    if (
                      e.which != 8 &&
                      e.which != 0 &&
                      (e.which < 48 || e.which > 57)
                    ) {
                      return false;
                    }
                  });

                  $(".sendInpValue").on("click", function () {
                    if ($(this).prev().val() !== "") {
                      conversation.sendMessage($(this).prev().val());

                      $(this).prev().val("");
                      $(".app__btnBox").show();
                    }
                  });
                }
              } else if (item.author === chatParams.userIdentity) {
                if (item.attributes.type == "button") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                  <div class="app__content--msg user newMessages">
                  <div class='in'>
                    ${item.attributes.text}
                    </div>
                  </div>
                `
                  );
                } else {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                  <div class="app__content--msg user newMessages">
                  <div class='in'>
                    ${item.body}
                    </div>
                  </div>
                `
                  );
                }
              } else {
                webchat.appendHtml(
                  chatContentBox,
                  `
                  <div class="app__content--msg bot newMessages">
                    <div class='in'>
                      ${item.body}
                    </div>
                  </div>
          `
                );
              }

              chatContentBox.scrollTo({
                behavior: "smooth",
                top: chatContentBox.scrollHeight,
              });
            });
          });
      }
    );
  };
}

startChat();
