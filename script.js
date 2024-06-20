const SIZE_MIN = 180,
  SIZE_MAX = 2048,
  SIZE_SLIDER = "8px";

const frame = document.getElementById("frame"),
  avatar = document.getElementById("avatar"),
  size = document.getElementById("size"),
  canvas = document.getElementById("canvas"),
  bgColour = document.getElementById("bgColour"),
  bgImage = document.getElementById("bgImage"),
  avatarScale = document.getElementById("avatarScale"),
  avatarScaleValue = document.getElementById("avatarScaleValue"),
  buttDownload = document.getElementById("buttDownload"),
  imgPosition = document.getElementsByClassName("imgPosition");

let frameImage = "./assets/frame.png",
  avatarImage = "./assets/avatar.png";

frame.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    frameImage = event.target.result;
    draw();
  };
  if (file) reader.readAsDataURL(file);
});

avatar.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    avatarImage = event.target.result;
    draw();
  };

  if (file) reader.readAsDataURL(file);
});

size.addEventListener("change", function (event) {
  let sizeValue = event.target.value;
  sizeValue < SIZE_MIN
    ? (sizeValue = SIZE_MIN)
    : sizeValue > SIZE_MAX
    ? (sizeValue = SIZE_MAX)
    : null;
  size.value = sizeValue;
  canvas.width = sizeValue;
  canvas.height = sizeValue;
  draw();
});

bgColour.addEventListener("change", function (event) {
  draw();
});

bgImage.addEventListener("change", function (event) {
  draw();
});

avatarScale.addEventListener("change", function (event) {
  avatarScaleValue.innerHTML = event.target.value;
  draw();
});

buttDownload.addEventListener("click", function () {
  var link = document.createElement("a");
  link.download = "japitSoCute.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

const draw = async () => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  await drawBg(ctx, avatarImage);
  await drawImg(ctx, avatarImage, true);
  await drawImg(ctx, frameImage);
};

const drawImg = async (ctx, _img, scaling, isBg) => {
  if (!_img) return;
  const imageObj = new Image();
  imageObj.src = _img;
  imageObj.onload = async function draw(e) {
    let cp1 = canvas.width / e.target.width,
      cp2 = canvas.height / e.target.height;
    let scale = isBg ? Math.max(cp1, cp2) : Math.min(cp1, cp2);
    if (scaling) scale *= avatarScaleValue.innerText;
    let width = e.target.width * scale,
      height = e.target.height * scale;
    let x = canvas.width / 2 - width / 2,
      y = canvas.height / 2 - height / 2;

    await ctx.drawImage(e.target, x, y, width, height);
  };
};

const drawBg = async (ctx, _img) => {
  if (bgImage.checked && avatarImage) {
    await drawImg(ctx, _img, false, true);
  } else {
    ctx.fillStyle = bgColour.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

const initial = () => {
  if (!imgPosition) return;
  let canvasSize = canvas.width;
  for (i = 0; i < imgPosition.length; i++) {
    if (!imgPosition[i].id == "imgPositionY") {
      imgPosition[i].style.marginTop = -canvasSize / 2 + "px";
      imgPosition[i].style.marginLeft = -canvasSize / 2 + "px";
    }
    imgPosition[i].style.height = SIZE_SLIDER;
    imgPosition[i].style.width = canvas.width + "px";
    imgPosition[i].addEventListener("change", function (event) {
      draw();
    });
  }
};

window.addEventListener("load", function () {
  initial();
  draw();
});
