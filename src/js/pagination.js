let loading = false;

let send;

// infinty scroll
document.querySelector(".app__content").onscroll = function () {
  if (pagination[0].hasPrevPage != false) {
    if (document.querySelector(".app__content").scrollTop == 0) {
      loading = true;

      if (loading == true) {
        document
          .querySelector(".app__spinnerBox")
          .classList.add("showSpinnner");
      }

      pagination[0].prevPage().then((data) => {
        if (pagination[0].prevPage != false) {
          pagination = [];
          pagination.push(data);

          if (msg.includes(...pagination[0].items) == false) {
            pagination[0].items.reverse().forEach((item) => {
              loading = false;

              send = false;

              if (loading == false) {
                document
                  .querySelector(".app__spinnerBox")
                  .classList.remove("showSpinnner");
              }

              if (item.author === chatParams.conversationSid) {
                // Botdan gelen  Message = ConversationSid

                if (JSON.parse(item.body).type == "text") {
                  webchat.prependHtml(
                    document.querySelector(".app__content"),
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
                  webchat.prependHtml(
                    chatContentBox,
                    `
                    <div  class="app__content--msg bot multipleSelection app__Like">
                      <div class='in'>
                        <div class="app__multipleTitle">
                          ${JSON.parse(item.body).body.text}
                        </div>
                      </div>
                    </div>
                    `
                  );
                }

                // rangeSlider
                else if (JSON.parse(item.body).type == "rangeSlider") {
                  webchat.prependHtml(
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
                  webchat.prependHtml(
                    chatContentBox,
                    `
                          <div class='app__content--msg app__sliderBox app__imageContainer'>
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
                  webchat.prependHtml(
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
                              <input disabled id=${item} type="checkbox" />
                              ${item}
                              </label>
                            </div>`
                            )
                            .join("")}
                        </div>
                      </div>

                    </div>
                    `
                  );
                } else if (JSON.parse(item.body).type == "carousel") {
                  webchat.prependHtml(
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
                } else if (JSON.parse(item.body).type == "phone") {
                  webchat.prependHtml(
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
                // video
                else if (JSON.parse(item.body).type == "video") {
                  webchat.prependHtml(
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

                if (JSON.parse(item.body).type == "textAndButtons") {
                  webchat.prependHtml(
                    document.querySelector(".app__content"),
                    `
                        <div class="app__content--msg bot">
                        <div class='in'>
                         ${JSON.parse(item.body).body.text}
                        </div>
                        </div>
                    `
                  );
                }
              } else if (item.author === chatParams.userIdentity) {
                // media
                if (item.type == "media") {
                  webchat.prependHtml(
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
                  webchat.prependHtml(
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
                    webchat.prependHtml(
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
                    webchat.prependHtml(
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
                webchat.prependHtml(
                  document.querySelector(".app__content"),
                  `
                    <div class="app__content--msg bot">
                      <div class='in'>
                        ${item.body}
                      </div>
                    </div>
                  `
                );
              }
            });

            if (loading === false) {
              $(".app__content").animate(
                {
                  scrollTop: 100,
                },
                "fast"
              );
            }
          }
        }
      });
    }
  }
};
