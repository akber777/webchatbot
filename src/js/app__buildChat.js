const storage = localStorage.getItem("tenantID");

const chatContentBox = document.querySelector(".app__content");

let msg = [];

let multipleSelection = [];

let multipleCheckedId = [];

let conversation;

let pagination = [];

let sliderTitle;

let loadingBtn = false;

let chatParams;

let awaitMedia;

function startChat(chatData) {
  if (localStorage.getItem("chatParams") == null) {
    chatParams = chatData;
  } else {
    chatParams = {
      conversationSid: JSON.parse(localStorage.getItem("chatParams"))
        .conversationSid,
      flowSid: JSON.parse(localStorage.getItem("chatParams")).flowSid,
      twilioToken: chatData.twilioToken,
      userIdentity: JSON.parse(localStorage.getItem("chatParams")).userIdentity,
    };
  }

  webchat.addlocalStorage("chatParams", chatParams);

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
                }

                // like
                else if (JSON.parse(item.body).type == "like") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                      <div  class="app__content--msg bot multipleSelection app__Like">
                        <div class='in'>
                          <div class="app__multipleTitle">
                            ${JSON.parse(item.body).body.text}
                          </div>
                          <div class="app__multipleItems ">
                          <button class='likeBtnxk'>
                          👍                        
                          </button>
                          <button class='unlikeBtnxk'>
                          👎                         
                          </button>
                          </div>
                        </div>
                      </div>
                      `
                  );

                  $(".likeBtnxk").on("click", function () {
                    conversation.sendMessage("true", { hiddenLike: true });
                    $(this).parents(".app__Like").find("button").hide();
                  });

                  $(".unlikeBtnxk").on("click", function () {
                    conversation.sendMessage("false", { hiddenLike: true });

                    $(this).parents(".app__Like").find("button").hide();
                  });
                }

                // rangeSlider
                else if (JSON.parse(item.body).type == "rangeSlider") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                    <div  class="app__content--msg bot multipleSelection app__rangeSlider">
                      <div class='in'>
                        <div class="app__multipleTitle">
                          ${JSON.parse(item.body).body.text}
                        </div>
                        <div class="app__multipleItems">
                        <input type="text" class="js-range-slider" name="my_range" value=""
                            data-type="double"
                            data-values=${JSON.parse(item.body).body.values}
                            data-grid="true"
                            data-prefix="$"
                        />
                        </div>
                        <div class="app__multipleConfirm">
                              <button class="confirmBtnRange">
                                Confirm
                              </button>
                        </div>
                      </div>

                    </div>
                    `
                  );

                  let step;

                  $(".js-range-slider").ionRangeSlider({
                    skin: "round",
                    min: JSON.parse(item.body).body.values[0],
                    max: JSON.parse(item.body).body.values[
                      JSON.parse(item.body).body.values.length - 1
                    ],
                    from: 0,
                    onStart: function (data) {
                      step = [data.from_value, data.to_value];
                    },
                    onFinish: function (data) {
                      step = [data.from_value, data.to_value];
                    },
                  });

                  $(".confirmBtnRange").on("click", function () {
                    let rangeVal = `$${step[0]} - $${step[1]}`;
                    conversation.sendMessage(rangeVal);

                    $(".app__rangeSlider").addClass("disabledMutliSelection");
                  });
                }

                // video
                else if (JSON.parse(item.body).type == "video") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                       <div class='app__content--msg app__sliderBox app__videoBox'>
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

                // image
                else if (JSON.parse(item.body).type == "image") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                        <div class='app__content--msg  app__sliderBox app__imageContainer'>
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
                // multiple selection
                else if (JSON.parse(item.body).type == "multipleSelection") {
                  multipleSelection = [];

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
                                ${JSON.parse(item.body).body.buttonText}
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

                      $(".multipleSelection").addClass(
                        "disabledMutliSelection"
                      );
                      $(".multipleSelection,input").attr("disabled", true);
                      $(".multipleSelection,button").attr("disabled", true);
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
                    <div class="app__content--msg bot textAndButtons">
                      <div class='in'>
                      ${
                        JSON.parse(item.body).body.text
                          ? `<div class="app__content--buttons">
                        <p>${JSON.parse(item.body).body.text}</p>
                      </div>`
                          : ""
                      }
                      ${JSON.parse(item.body)
                        .body.buttons.map(
                          (item, index) =>
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
                        .join("")}
                      </div>
                    </div>
              `
                  );

                  $(".btnChat").on("click", function () {
                    conversation.sendMessage($(this).text(), {
                      type: "btn",
                    });

                    $(this).parents(".textAndButtons").hide();
                  });
                }

                //phone
                else if (JSON.parse(item.body).type == "phone") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                    <div class="app__content--msg bot botPhone">
                    <div class='in'>
                    <div class="app__content--buttons">
                       <p>${JSON.parse(item.body).body.text}</p>
                    </div>
                    </div>
                    </div>
                    `
                  );
                }
              } else if (item.author === chatParams.userIdentity) {
                // media
                if (item.type == "media") {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                  <div class="app__content--msg voiceMsgUser user">
                  <div class='in'>
                    <div id=${item.sid}>
                   
                    </div>
                  </div>
                  </div>
                `
                  );

                  item.media.getContentTemporaryUrl().then((data) => {
                    $(`#${item.sid}`).html(`
                        <div id=${item.sid + "app"} class='audioAppBoxBot'>
                          <audio>
                              <source src=${data} type="audio/wav">
                          </audio>
                        </div>
                      `);

                    new GreenAudioPlayer("#" + item.sid + "app");

                    chatContentBox.scrollTo({
                      behavior: "smooth",
                      top: chatContentBox.scrollHeight,
                    });
                  });
                }
                // btn
                else if (item.attributes.type == "button") {
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
                  if (item.attributes.hiddenLike != true) {
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
                  } else {
                    webchat.appendHtml(
                      chatContentBox,
                      `
                    <div class="app__content--msg user newMessages">
                    <div class='in'>
                    ${item.attributes.btn}
                      </div>
                    </div>
                  `
                    );
                  }
                }
              }
              // live chat
              else {
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

              if (
                $(".app__content--msg.multipleSelection:last").next().length !==
                0
              ) {
                $(".app__content--msg.multipleSelection").addClass(
                  "disabledMulti"
                );
                $(".app__content--msg.multipleSelection input").prop(
                  "disabled",
                  true
                );
              }

              if (
                $(".app__content--msg.textAndButtons:last").next().length !== 0
              ) {
                $(".app__content--msg.textAndButtons").addClass(
                  "disabledMulti"
                );
              }
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

              // like
              else if (JSON.parse(item.body).type == "like") {
                webchat.appendHtml(
                  chatContentBox,
                  `
                    <div  class="app__content--msg bot multipleSelection app__Like">
                      <div class='in'>
                        <div class="app__multipleTitle">
                          ${JSON.parse(item.body).body.text}
                        </div>
                        <div class="app__multipleItems ">
                        <button class='likeBtnxk'>
                        👍                         
                        </button>
                        <button class='unlikeBtnxk'>
                        👎                        
                        </button>
                        </div>
                      </div>
                    </div>
                    `
                );

                $(".likeBtnxk").on("click", function () {
                  conversation.sendMessage("true", {
                    hiddenLike: true,
                    btn: "👍",
                  });
                  $(this).parents(".app__Like").find("button").hide();
                });

                $(".unlikeBtnxk").on("click", function () {
                  conversation.sendMessage("false", {
                    hiddenLike: true,
                    btn: "👎",
                  });

                  $(this).parents(".app__Like").find("button").hide();
                });
              }
              // rangeSlider
              else if (JSON.parse(item.body).type == "rangeSlider") {
                webchat.appendHtml(
                  chatContentBox,
                  `
                <div  class="app__content--msg bot multipleSelection app__rangeSlider">
                  <div class='in'>
                    <div class="app__multipleTitle">
                      ${JSON.parse(item.body).body.text}
                    </div>
                    <div class="app__multipleItems">
                    <input type="text" class="js-range-slider" name="my_range" value=""
                        data-type="double"
                        data-values=${JSON.parse(item.body).body.values}
                        data-grid="true"
                        data-prefix="$"
                    />
                    </div>
                    <div class="app__multipleConfirm">
                          <button class="confirmBtnRange">
                            Confirm
                          </button>
                    </div>
                  </div>

                </div>
                `
                );

                let step;

                $(".js-range-slider").ionRangeSlider({
                  skin: "round",
                  min: JSON.parse(item.body).body.values[0],
                  max: JSON.parse(item.body).body.values[
                    JSON.parse(item.body).body.values.length - 1
                  ],
                  from: 0,
                  onStart: function (data) {
                    step = [data.from_value, data.to_value];
                  },
                  onFinish: function (data) {
                    step = [data.from_value, data.to_value];
                  },
                });

                $(".confirmBtnRange").on("click", function () {
                  let rangeVal = `$${step[0]} - $${step[1]}`;
                  conversation.sendMessage(rangeVal);

                  $(".app__rangeSlider").addClass("disabledMutliSelection");
                });
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
                multipleSelection = [];
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
                            (item, index) => `<div>
                            <label for=${item} data-check=${index}>
                            <input id=${item} type="checkbox" />
                            ${item}
                            </label>
                          </div>`
                          )
                          .join("")}
                      </div>
                      <div class="app__multipleConfirm">
                            <button>
                            ${JSON.parse(item.body).body.buttonText}
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
                      multipleCheckedId.push($(this).attr("data-check"));
                    }
                  } else {
                    multipleSelection = multipleSelection.filter(
                      (e) => e !== $(this).text().trim()
                    );
                    multipleCheckedId = multipleCheckedId.filter(
                      (e) => e !== $(this).attr("data-check")
                    );
                  }
                });

                $(".app__multipleConfirm button").on("click", function () {
                  if (multipleSelection.length !== 0) {
                    conversation.sendMessage(multipleSelection.toString(), {
                      checked: multipleCheckedId,
                    });
                  }
                });
              }

              // carousel
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
                    $(this).parents(".app__sliderBox--info").find("h4").text() +
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
                <div class="app__content--msg bot  textAndButtons">
                  <div class='in'>
                  ${
                    JSON.parse(item.body).body.text
                      ? `<div class="app__content--buttons">
                    <p>${JSON.parse(item.body).body.text}</p>
                  </div>`
                      : ""
                  }
                      ${JSON.parse(item.body)
                        .body.buttons.map(
                          (item, index) =>
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
                        .join("")}
                      </div>
                    </div>
                      `
                );

                $(".btnChat").on("click", function () {
                  conversation.sendMessage($(this).text(), {
                    type: "btn",
                  });

                  $(this).parents(".textAndButtons").hide();
                });
              }

              // phone input
              else if (JSON.parse(item.body).type == "phone") {
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
              }
            } else if (item.author === chatParams.userIdentity) {
              // media
              if (item.type == "media") {
                webchat.appendHtml(
                  chatContentBox,
                  `
                <div class="app__content--msg voiceMsgUser user">
                <div class='in'>
                  <div id=${item.sid}>
                 
                  </div>
                </div>
                </div>
              `
                );

                item.media.getContentTemporaryUrl().then((data) => {
                  $(`#${item.sid}`).html(`
                      <div id=${item.sid + "app"} class='audioAppBoxBot'>
                        <audio>
                            <source src=${data} type="audio/wav">
                        </audio>
                      </div>
                    `);

                  new GreenAudioPlayer("#" + item.sid + "app");

                  chatContentBox.scrollTo({
                    behavior: "smooth",
                    top: chatContentBox.scrollHeight,
                  });
                });
              } else if (item.attributes.type == "button") {
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
                if (item.attributes.hiddenLike != true) {
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
                } else {
                  webchat.appendHtml(
                    chatContentBox,
                    `
                  <div class="app__content--msg user newMessages">
                  <div class='in'>
                  ${item.attributes.btn}
                    </div>
                  </div>
                `
                  );
                }
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
}
