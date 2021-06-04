$("document").ready(function () {
  $(".app__btn").on("click", function () {
    $(".app__container").toggleClass("show");
  });

  $(".app__closeBtn").on("click", function () {
    $(".app__container").removeClass("show");
  });
});
