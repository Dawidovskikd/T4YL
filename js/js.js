function onCountryLeaveFunction(paths, $countryInfoDiv, activePins) {
    $(paths)
        .stop()
        .animate({
        'opacity': 1
    }, 150, function () {
        $(paths).removeAttr('style');
    })
        .removeAttr('filter');
    $countryInfoDiv
        .removeClass('active');
    hidePins(activePins);
}
function hidePins(activePins) {
    if (activePins) {
        activePins
            .css({
            display: 'none'
        });
    }
}
window.onload = function () {
    $('.loading-screen')
        .animate({
        opacity: 0
    }, 500, function () {
        $('.loading-screen').css({
            display: 'none'
        });
    });
    var object = document.getElementById("worldMapObject"), objectDoc = object.contentDocument, svg = objectDoc.childNodes[1], panZoom, countryInfoDiv = document.getElementById('country-info'), pins = objectDoc.getElementsByClassName('pin'), $countryInfoDiv = $(countryInfoDiv), $locationDiv = $('#location-info');
    // Hide pins
    hidePins($(pins));
    $(svg).mousemove(function (e) {
        $countryInfoDiv
            .css({
            top: e.clientY - 15,
            left: e.clientX
        });
    });
    //SVG Pan zoom initialization
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
    // On resize handlers
    $(window).resize(function () {
        panZoom.destroy();
        initWorldPan();
    });
    var paths = objectDoc.querySelectorAll('path, polygon'), activePins;
    // var paths = document.getElementsByTagName('path');
    for (var i = 0, len = paths.length; i < len; i++) {
        var el = $(paths[i]);
        el.mouseover(function () {
            var self = $(this);
            // self.toFront();
            self.attr({
                cursor: 'pointer'
            });
            // Blur and add opacity to elements that are not currently hovered
            for (var j = 0, len = paths.length; j < len; j++) {
                if (this != paths[j]) {
                    $(paths[j])
                        .stop()
                        .animate({
                        'opacity': 0.8
                    }, 150)
                        .attr({
                        'filter': 'url(\'#blur_1\')'
                    });
                }
            }
            // Countries with pins
            if (this.id == 'usa') {
                showCountryInfoBox();
            }
            else {
                hideCountryInfoBox();
                hidePins(activePins);
            }
        });
        el.mouseout(function (e) {
            var targetInPins = false, pathContainingPin = e.delegateTarget, goingTo = (e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.parentElement) ? e.relatedTarget.parentElement.parentElement : null;
            var mouseleaveFromPin = function () {
                console.log(e.relatedTarget);
                console.log(pathContainingPin);
                if (e.relatedTarget != pathContainingPin) {
                    onCountryLeaveFunction(paths, $countryInfoDiv, activePins);
                }
                $('body')
                    .off('mouseleave', $(goingTo).selector, mouseleaveFromPin);
            };
            $(pins).each(function (i, el) {
                if (el == goingTo) {
                    targetInPins = true;
                }
            });
            if (!targetInPins) {
                onCountryLeaveFunction(paths, $countryInfoDiv, activePins);
            }
            else {
                $(goingTo).mouseleave(function () {
                    $('body')
                        .on('mouseleave', $(goingTo).selector, mouseleaveFromPin);
                });
            }
        });
        el.click(function () {
        });
        // Pins
        $(pins)
            .mouseover(function (e) {
            hideCountryInfoBox();
            showLocationInfo();
        })
            .mouseleave(function () {
            hideLocationInfo();
        })
            .click(function () {
            window.location.href = window.location.protocol + '//' + window.location.hostname + "/lokacje/pierwszalokacja.html";
        });
    }
    // utility functions
    function showCountryInfoBox() {
        $countryInfoDiv
            .addClass('active');
        activePins = $(pins)
            .filter('.usa');
        if (activePins) {
            activePins
                .css({
                display: 'block'
            });
            var countryBoxText = activePins.length;
            switch (activePins.length) {
                case 1: {
                    countryBoxText += ' wpis';
                    break;
                }
                case 2:
                case 3:
                case 4: {
                    countryBoxText += ' wpisy';
                    break;
                }
                default: {
                    countryBoxText += ' wpisów';
                    break;
                }
            }
            document.getElementsByClassName('country-info__text')[0].innerHTML = countryBoxText;
        }
    }
    function hideCountryInfoBox() {
        $countryInfoDiv
            .removeClass('active');
    }
    function showLocationInfo() {
        $locationDiv
            .addClass('active');
    }
    function hideLocationInfo() {
        $locationDiv
            .removeClass('active');
    }
};
