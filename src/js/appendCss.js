const linkMain = document.createElement("link");
linkMain.rel = "stylesheet";
linkMain.href =
  "https://res.cloudinary.com/gocreative/raw/upload/v1622708245/main.min_b2bgnm.css";

const linkSplide = document.createElement("link");
linkSplide.rel = "stylesheet";
linkSplide.href =
  "https://cdn.jsdelivr.net/npm/@splidejs/splide@2.4.21/dist/css/themes/splide-default.min.css";

document.querySelector("head").appendChild(linkSplide);

document.querySelector("head").appendChild(linkMain);

