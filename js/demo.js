(function () {
  var canvas = new fabric.Canvas("shirtDiv");
  canvas.setWidth(530);
  canvas.setHeight(630);

  var backgroundImage = "./img/crew_front.png";
  addImageToCanvas(backgroundImage);

  function addImageToCanvas(backgroundImage) {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Image.fromURL(backgroundImage, function (object) {
      canvas.clear();
      var background = object.set({
        left: 0,
        top: 0,
        width: 530,
        height: 630,
      });
      background.selectable = false;
      canvas.add(background);

      var cilpRectangle = new fabric.Rect({
        originX: "left",
        originY: "top",
        left: 160,
        top: 120,
        width: 200,
        height: 360,
        fill: "transparent",
        stroke: "rgba(206, 206, 206)",
        strokeDashArray: [5, 5],
        selectable: false,
      });
      cilpRectangle.set({
        clipFor: "layer",
      });
      canvas.add(cilpRectangle);
    });
  }

  addLayerToCanvas();
  function addLayerToCanvas() {
    var clickedImage = new Image();
    clickedImage.onload = function (img) {
      var pug = new fabric.Image(clickedImage, {
        width: 100,
        height: 100,
        left: 150,
        top: 150,
        clipName: "layer",
        clipTo: function (ctx) {
          return _.bind(clipByName, pug)(ctx);
        },
      });
      canvas.add(pug);
    };
    clickedImage.src = "./img/css.png";
  }

  function clipByName(ctx) {
    this.setCoords();
    var clipRect = findByClipName(this.clipName);
    var scaleXTo1 = 1 / this.scaleX;
    var scaleYTo1 = 1 / this.scaleY;
    ctx.save();
    var ctxLeft = -(this.width / 2) + clipRect.strokeWidth;
    var ctxTop = -(this.height / 2) + clipRect.strokeWidth;
    var ctxWidth = clipRect.width - clipRect.strokeWidth;
    var ctxHeight = clipRect.height - clipRect.strokeWidth;
    ctx.translate(ctxLeft, ctxTop);
    ctx.scale(scaleXTo1, scaleYTo1);
    ctx.rotate(degToRad(this.angle * -1));
    ctx.beginPath();
    ctx.rect(
      clipRect.left - this.oCoords.tl.x,
      clipRect.top - this.oCoords.tl.y,
      clipRect.width,
      clipRect.height
    );
    ctx.closePath();
    ctx.restore();
  }
  function findByClipName(name) {
    return _(canvas.getObjects())
      .where({
        clipFor: name,
      })
      .first();
  }

  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
})();
