const chatWrapper = document.querySelector("body");

const html = `
<div id="App" class="app">
<div class="app__container">
<div class="app__title">
<div class="app__closeBtn">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 7.5L12 16.5L3 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
  <div class="app__circle"></div>
  <span>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.6155 0.000488281H7.3845C3.306 0.000488281 0 3.30649 0 7.38499V16.616C0 20.6945 3.306 24.0005 7.3845 24.0005H24V7.38499C24 3.30649 20.694 0.000488281 16.6155 0.000488281ZM16.6158 2.76938C19.1613 2.76938 21.2313 4.84013 21.2313 7.38488V21.2314H7.38477C4.84002 21.2314 2.77002 19.1606 2.77002 16.6159V7.38488C2.77002 4.84013 4.84002 2.76938 7.38477 2.76938H16.6158ZM5.12695 12.0001C5.12695 13.0883 6.0127 13.9748 7.1017 13.9748C8.1907 13.9748 9.07645 13.0883 9.07645 12.0001C9.07645 10.9118 8.1907 10.0253 7.1017 10.0253C6.0127 10.0253 5.12695 10.9118 5.12695 12.0001ZM10.0254 12.0001C10.0254 13.0883 10.9111 13.9748 12.0001 13.9748C13.0891 13.9748 13.9749 13.0883 13.9749 12.0001C13.9749 10.9118 13.0891 10.0253 12.0001 10.0253C10.9111 10.0253 10.0254 10.9118 10.0254 12.0001ZM14.9238 12.0001C14.9238 13.0883 15.8096 13.9748 16.8986 13.9748C17.9876 13.9748 18.8733 13.0883 18.8733 12.0001C18.8733 10.9118 17.9876 10.0253 16.8986 10.0253C15.8096 10.0253 14.9238 10.9118 14.9238 12.0001Z"
        fill="#1089FF"
      />
    </svg>
  </span>
  <p>Chat with us now!</p>
</div>
<div class="app__spinnerBox">
  <div id="spinner"></div>
</div>
<div class="app__content"></div>
<div class="app__scrollBoxContent"></div>
<div class="app__btnBox">
  <form>
    <div class="app__formBox">
      <p>
        <input type="file" style="display: none" />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.4543 9.18124L9.20908 13.4478C8.56989 14.0902 8.56989 15.1324 9.20908 15.7748V15.7748C9.84826 16.4172 10.8852 16.4172 11.5244 15.7748L17.1207 10.1503C18.2931 8.97203 18.2931 7.06194 17.1207 5.88369V5.88369C15.9484 4.70544 14.0478 4.70544 12.8755 5.88369L7.27914 11.5082C5.57362 13.2223 5.57362 16.0003 7.27914 17.7144V17.7144C8.98467 19.4285 11.7488 19.4285 13.4543 17.7144L16.8507 14.301"
            stroke="#1E2F42"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <input class="textInput" type="text" placeholder="Type anything" />
      </p>
      <p>
        <button class="sendBtn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.4809 18.7102L21.4679 12.8782C22.1769 12.5022 22.1769 11.4902 21.4679 11.1132L10.4969 5.29018C9.66894 4.85018 8.74094 5.68018 9.09194 6.54618L11.2809 11.9462L9.07394 17.4562C8.72794 18.3232 9.65494 19.1482 10.4809 18.7102Z"
              stroke="#1089FF"
              stroke-width="1.5036"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.28 11.9497L22 11.9996"
              stroke="#1089FF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 14.9996H5.6"
              stroke="#1089FF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 11.9996H5.6"
              stroke="#1089FF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 8.99957H5.6"
              stroke="#1089FF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </p>
    </div>
  </form>
</div>
</div>
<button class="app__btn">
<svg
  width="28"
  height="28"
  viewBox="0 0 28 28"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M19.3848 0H8.61525C3.857 0 0 3.857 0 8.61525V19.3848C0 24.143 3.857 28 8.61525 28H28V8.61525C28 3.857 24.143 0 19.3848 0ZM19.3848 3.23058C22.3546 3.23058 24.7696 5.64645 24.7696 8.61533V24.7696H8.61532C5.64645 24.7696 3.23145 22.3537 3.23145 19.3848V8.61533C3.23145 5.64645 5.64645 3.23058 8.61532 3.23058H19.3848ZM5.98145 13.9993C5.98145 15.269 7.01482 16.3032 8.28532 16.3032C9.55582 16.3032 10.5892 15.269 10.5892 13.9993C10.5892 12.7297 9.55582 11.6955 8.28532 11.6955C7.01482 11.6955 5.98145 12.7297 5.98145 13.9993ZM11.6963 13.9993C11.6963 15.269 12.7297 16.3032 14.0002 16.3032C15.2707 16.3032 16.304 15.269 16.304 13.9993C16.304 12.7297 15.2707 11.6955 14.0002 11.6955C12.7297 11.6955 11.6963 12.7297 11.6963 13.9993ZM17.4111 13.9993C17.4111 15.269 18.4445 16.3032 19.715 16.3032C20.9855 16.3032 22.0189 15.269 22.0189 13.9993C22.0189 12.7297 20.9855 11.6955 19.715 11.6955C18.4445 11.6955 17.4111 12.7297 17.4111 13.9993Z"
    fill="white"
  />
</svg>
</button>
<div>
`;

webchat.appendHtml(chatWrapper, html);
