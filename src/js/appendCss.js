const linkMain = document.createElement("link");
linkMain.rel = "stylesheet";
linkMain.href =
  "https://res.cloudinary.com/gocreative/raw/upload/v1622708245/main.min_bd2bgnm.css";

const linkSplide = document.createElement("link");
linkSplide.rel = "stylesheet";
linkSplide.href =
  "https://cdn.jsdelivr.net/npm/@splidejs/splide@2.4.21/dist/css/themes/splide-default.min.css";

const linkRangeSLider = document.createElement("link");
linkRangeSLider.rel = "stylesheet";
linkRangeSLider.href =
  "https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/css/ion.rangeSlider.min.css";

document.querySelector("head").appendChild(linkSplide);

document.querySelector("head").appendChild(linkMain);

document.querySelector("head").appendChild(linkRangeSLider);
