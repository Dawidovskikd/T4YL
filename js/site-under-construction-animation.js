function sprite (options) {

    var that = {},
        frameIndex = 10,
        tickCount = 0,
        ticksPerFrame = 1,
        numberOfFrames = options.numberOfFrames || 1,
        verticalOffset;

    that.canvas = options.canvas;
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.loop = options.loop;

    that.onLastFrame = function () {
        return frameIndex == numberOfFrames - 1;
    };

    that.onFirstFrame = function () {
        return frameIndex == 0;
    };

    that.resize = function () {
        verticalOffset = ( that.canvas.width - that.canvas.height ) / 2;
        verticalOffset = ( verticalOffset >= 0 ) ? verticalOffset : 0;
        that.drawingWidth = that.canvas.height * (((that.width/that.height) < (that.canvas.width/that.canvas.height)) ? 1 : (that.width /that.height)) ;
        that.drawingHeigth = that.canvas.height * (((that.width/that.height) > (that.canvas.width/that.canvas.height)) ? 1 : (that.height /that.width) );
    };

    that.render = function () {


        // Clear the wholeLamaCanvas
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);

        // Draw the animation
        that.context.drawImage(
            that.image,
            frameIndex * that.width ,
            0,
            that.width ,
            that.height,
            0,
            0,
            that.canvas.width,
            that.canvas.height
        );
    };

    that.update = function (direction) {

        tickCount += 1;

        if (tickCount > ticksPerFrame) {

            tickCount = 0;

            if (direction == 'backward' ){
                if( frameIndex > 0 ){
                    frameIndex -= 1;
                } else if(that.loop) {
                    frameIndex = 0;
                }
            } else if (frameIndex < numberOfFrames - 1) {
                // Go to the next frame
                frameIndex += 1;
            } else if(that.loop) {
                frameIndex = 0;
            }
        }
    };
    that.animate = function () {
        window.requestAnimationFrame(that.animate);
        that.update();
        that.render();
    };
    return that;
}

var planeSpriteImage = new Image();
planeSpriteImage.src = "images/sprite/plane-sprite.png";


$(document).ready(function () {

    // var planeCanvas = document.getElementById("plane");
    // var planeSprite = sprite({
    //     canvas: planeCanvas,
    //     context: planeCanvas.getContext("2d"),
    //     width: 658,
    //     height: 420,
    //     image: planeSpriteImage,
    //     numberOfFrames: 90,
    //     loop: true
    // });
    //
    // //Starting plane animation
    // if(planeSpriteImage.complete){
    //     planeSprite.animate();
    // }else{
    //     $(planeSpriteImage).on('load' , planeSprite.animate);
    // }

});

