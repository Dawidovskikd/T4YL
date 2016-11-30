var object, objectDoc, svg, panZoom;
window.onload = function () {
    object = document.getElementById("worldMapObject");
    objectDoc = object.contentDocument;
    svg = objectDoc.childNodes[1];
    function initWorldPan() {
        var beforePan = function (oldPan, newPan) {
            var stopHorizontal = false, stopVertical = false, gutterWidth = window.innerWidth / 2, gutterHeight = window.innerHeight / 2, sizes = this.getSizes(), leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth, rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom), topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight, bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom), customPan = { x: 0, y: 0 };
            customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
            customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
            return customPan;
        };
        panZoom = svgPanZoom(svg, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            zoomScaleSensitivity: 0.4,
            minZoom: 1.2,
            fit: true,
            center: true,
            beforePan: beforePan
        });
    }
    initWorldPan();
    $(window).resize(function () {
        panZoom.destroy();
        initWorldPan();
    });
    var paths = objectDoc.querySelectorAll('path, polygon');
    var paths = document.getElementsByTagName('path');
    for (var i = 0, len = paths.length; i < len; i++) {
        var el = $(paths[i]);
        el.mouseover(function () {
            var self = $(this);
            // self.toFront();
            self.attr({
                cursor: 'pointer'
            });
            self.css({});
            for (var j = 0, len = paths.length; j < len; j++) {
                if (this != paths[j]) {
                    $(paths[j])
                        .css({
                        'opacity': 0.5
                    })
                        .attr({
                        'filter': 'url(\'#blur_1\')'
                    });
                }
            }
        });
        el.mouseout(function () {
            var self = $(this);
            $(paths)
                .removeAttr('style')
                .removeAttr('filter');
        });
        el.click(function () {
            // this.animate({
            //     fill: 'green'
            // }, 200);
        });
    }
};
