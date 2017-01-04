$(document).ready(function () {
    if ($('.location')[0]) {
        var $mainImage = $('.main_image'), $gallery = $('.gallery'), $content_1 = $('.content'), $contentParagraphs_1 = $content_1.children();
        $mainImage.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.gallery',
            lazyLoad: 'ondemand'
        });
        $gallery.slick({
            arrows: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.main_image',
            focusOnSelect: true,
            dots: false,
            centerMode: true,
            lazyLoad: 'ondemand'
        });
        trunkLastParagraph();
        function trunkLastParagraph() {
            var containerHeight = $content_1.height(), currentOffset = 0;
            console.log(containerHeight);
            for (var i = 0; i < $contentParagraphs_1.length; i++) {
                currentOffset += $contentParagraphs_1[i].clientHeight;
                console.log(currentOffset);
                if (currentOffset > containerHeight) {
                    var delta = currentOffset - containerHeight;
                    $($contentParagraphs_1[i])
                        .height(Math.floor(($contentParagraphs_1[i].clientHeight - delta) / 14) * 14)
                        .css({
                        'padding-bottom': 0,
                        'margin-bottom': '10px',
                        'overflow': 'hidden'
                    });
                    console.log('Last paragraph');
                    break;
                }
            }
        }
    }
});
function showMoreLocationText() {
    $('.content')
        .removeClass('excerpt')
        .children()
        .removeAttr('style');
    $('#show-more-button').remove();
}
window.onload = function () {
    if ($('.loading-screen')[0]) {
        setTimeout(function () {
            $('.loading-screen')
                .animate({
                opacity: 0
            }, 500, function () {
                $('.loading-screen').css({
                    display: 'none'
                });
            });
        }, 1000);
        var object = document.getElementById("worldMapObject"), objectDoc_1 = object.contentDocument, svg_1 = objectDoc_1.childNodes[1], panZoom_1, countryInfoDiv = document.getElementById('country-info'), pins = objectDoc_1.getElementsByClassName('pin'), $body_1 = $('body'), $pins_1 = $(pins), $newPins = $pins_1.filter(function (index, element) {
            return $(element).hasClass('new');
        }), $oldPins_1 = $pins_1.filter(function (index, element) {
            return !$(element).hasClass('new');
        }), $countryInfoDiv_1 = $(countryInfoDiv), $locationDiv_1 = $('.location_info');
        // Hide pins
        hidePins($oldPins_1);
        // Hidden country's posts number info div
        $(svg_1).mousemove(function (e) {
            $countryInfoDiv_1
                .css({
                top: e.clientY - 15,
                left: e.clientX
            });
        });
        //SVG Pan zoom initialization
        initWorldPan();
        // On resize handlers
        $(window).resize(function () {
            panZoom_1.destroy();
            initWorldPan();
        });
        var paths_1 = objectDoc_1.querySelectorAll('path, polygon'), $paths_1 = $(paths_1), activePins_1 = $newPins;
        // var paths = document.getElementsByTagName('path');
        // Paths
        var _loop_1 = function(i, len) {
            var el = $(paths_1[i]);
            el.attr({
                cursor: 'pointer'
            });
            el.mouseover(function () {
                var self = $(this);
                // self.toFront();
                self
                    .removeAttr('filter')
                    .removeAttr('style');
                // Blur and add opacity to elements that are not currently hovered
                $paths_1
                    .filter(function (index, element) {
                    return element != paths_1[i];
                    // return collection without current element
                })
                    .stop()
                    .animate({
                    'opacity': 0.8
                }, 150)
                    .attr({
                    'filter': 'url(\'#blur_1\')'
                });
                // Countries with pins
                if (this.id !== '') {
                    showCountryInfoBox(this.id);
                }
                else {
                    hideCountryInfoBox();
                    hidePins($oldPins_1);
                }
            });
            el.mouseout(function (e) {
                var targetIsPin = false, pathContainingPin = e.delegateTarget, goingTo = (e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.parentElement) ? e.relatedTarget.parentElement.parentElement : null;
                var mouseleaveFromPin = function () {
                    if (e.relatedTarget != pathContainingPin) {
                        onCountryLeaveFunction(e.relatedTarget, $countryInfoDiv_1, activePins_1);
                    }
                    $body_1
                        .off('mouseleave', $(goingTo).selector, mouseleaveFromPin);
                };
                $pins_1.each(function (i, el) {
                    if (el == goingTo) {
                        targetIsPin = true;
                    }
                });
                if (!targetIsPin) {
                    onCountryLeaveFunction(e.relatedTarget, $countryInfoDiv_1, activePins_1);
                }
                else {
                    $(goingTo).mouseleave(function () {
                        $body_1
                            .on('mouseleave', $(goingTo).selector, mouseleaveFromPin);
                    });
                }
            });
            el.click(function () {
            });
        };
        for (var i = 0, len = paths_1.length; i < len; i++) {
            _loop_1(i, len);
        }
        // Pins
        $pins_1
            .mouseenter(function (e) {
            var thisID = this.id.match(/\d+/)[0], country = $(this).data('country'), $country = $(objectDoc_1.getElementById(country));
            if (country !== '') {
                $country
                    .removeAttr('filter')
                    .removeAttr('style');
                $paths_1
                    .filter(function (index, element) {
                    return element != $country[0];
                    // return collection without pin's country
                })
                    .stop()
                    .animate({
                    'opacity': 0.8
                }, 150)
                    .attr({
                    'filter': 'url(\'#blur_1\')'
                });
            }
            hideCountryInfoBox();
            showLocationInfo(thisID, e);
        })
            .mouseleave(function (e) {
            var targetIsPin = false, pathContainingPin = e.delegateTarget, goingTo = (e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.parentElement) ? e.relatedTarget.parentElement.parentElement : null;
            var mouseleaveFromPin = function () {
                if (e.relatedTarget != pathContainingPin) {
                    onCountryLeaveFunction(e.relatedTarget, $countryInfoDiv_1, activePins_1);
                }
                $body_1
                    .off('mouseleave', $(goingTo).selector, mouseleaveFromPin);
            };
            $pins_1.each(function (i, el) {
                if (el == goingTo) {
                    targetIsPin = true;
                }
            });
            if (!targetIsPin) {
                onCountryLeaveFunction(e.relatedTarget, $countryInfoDiv_1, activePins_1);
            }
            else {
                $(goingTo).mouseleave(function () {
                    $body_1
                        .on('mouseleave', $(goingTo).selector, mouseleaveFromPin);
                });
            }
            hideLocationInfo();
        })
            .click(function () {
            var redirect = window.location.protocol + '//' + window.location.hostname + "/develop/lokacje/";
            switch (this.id.match(/\d+/)[0]) {
                //Sri Lanka
                case '228': {
                    window.location.href = redirect + "sri_lanka.html";
                    break;
                }
                case '229': {
                    window.location.href = redirect + "sri_lanka_2.html";
                    break;
                }
                //Genewa
                case '241': {
                    window.location.href = redirect + "genewa.html";
                    break;
                }
                //Kluż-Napoka
                case '248': {
                    window.location.href = redirect + "kluz_napoka.html";
                    break;
                }
                //reszta później
                default: {
                    window.location.href = redirect + "kluz_napoka.html";
                }
            }
        });
        // Blur adjusting based on zoom
        var filterBlur_1 = objectDoc_1.getElementById('blur_1').children[0];
        function changeBlurValue(value) {
            filterBlur_1.setAttribute('stdDeviation', value);
        }
        function onZoomBlurValueChange(zoomValue) {
            var newStdDeviation = 1 / zoomValue;
            changeBlurValue(newStdDeviation.toString());
        }
        // utility functions
        function initWorldPan() {
            var beforePan = function (oldPan, newPan) {
                var stopHorizontal = false, stopVertical = false, gutterWidth = window.innerWidth / 2, gutterHeight = window.innerHeight / 2, sizes = this.getSizes(), leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth, rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom), topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight, bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom), customPan = { x: 0, y: 0 };
                customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
                customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
                return customPan;
            }, onZoom = function (zoomValue) {
                onZoomBlurValueChange(zoomValue);
            }, eventsHandler = {
                haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
                init: function (options) {
                    var instance = options.instance, initialScale = 1, pannedX = 0, pannedY = 0;
                    // Init Hammer
                    // Listen only for pointer and touch events
                    this.hammer = new Hammer(options.svgElement, {
                        // inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
                        inputClass: Hammer.TouchInput
                    });
                    // Enable pinch
                    this.hammer.get('pinch').set({ enable: true });
                    // Handle double tap
                    this.hammer.on('doubletap', function (ev) {
                        instance.zoomIn();
                    });
                    // Handle pan
                    this.hammer.on('panstart panmove', function (ev) {
                        // On pan start reset panned variables
                        if (ev.type === 'panstart') {
                            pannedX = 0;
                            pannedY = 0;
                        }
                        // Pan only the difference
                        instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
                        pannedX = ev.deltaX;
                        pannedY = ev.deltaY;
                    });
                    // Handle pinch
                    this.hammer.on('pinchstart pinchmove', function (ev) {
                        // On pinch start remember initial zoom
                        if (ev.type === 'pinchstart') {
                            initialScale = instance.getZoom();
                            instance.zoom(initialScale * ev.scale);
                        }
                        instance.zoom(initialScale * ev.scale);
                    });
                    // Prevent moving the page on some devices when panning over SVG
                    options.svgElement.addEventListener('touchmove', function (e) { e.preventDefault(); });
                },
                destroy: function () {
                    this.hammer.destroy();
                }
            };
            panZoom_1 = svgPanZoom(svg_1, {
                zoomEnabled: true,
                zoomScaleSensitivity: 0.4,
                minZoom: 1.2,
                fit: true,
                center: true,
                beforePan: beforePan,
                onZoom: onZoom,
                customEventsHandler: eventsHandler
            });
        }
        function showCountryInfoBox(id) {
            $countryInfoDiv_1
                .addClass('active');
            activePins_1 = $pins_1
                .filter('.' + id);
            if (activePins_1) {
                activePins_1
                    .css({
                    display: 'block'
                });
                var countryBoxText = activePins_1.length;
                switch (activePins_1.length) {
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
            $countryInfoDiv_1
                .removeClass('active');
        }
        function showLocationInfo(pinID, mouseEvent) {
            //Check where is pin to not overlay info box
            if (mouseEvent.clientX < window.innerWidth / 2) {
                $locationDiv_1.addClass('right');
            }
            else {
                $locationDiv_1.addClass('left');
            }
            $locationDiv_1
                .filter(function (index, element) {
                return element.id.indexOf(pinID) > -1;
            })
                .addClass('active');
        }
        function hideLocationInfo() {
            $locationDiv_1
                .removeClass('active left right');
        }
        function onCountryLeaveFunction(relatedTarget, $countryInfoDiv, activePins) {
            var isGoingToAnotherCountry = svg_1 == relatedTarget;
            if (isGoingToAnotherCountry) {
                $paths_1
                    .stop()
                    .animate({
                    'opacity': 1
                }, 150, function () {
                    $paths_1.removeAttr('style');
                })
                    .removeAttr('filter');
            }
            $countryInfoDiv
                .removeClass('active');
            hidePins(activePins.filter(function (index, element) {
                return !$(element).hasClass('new');
            }));
        }
        function hidePins(activePins) {
            if (activePins) {
                activePins
                    .css({
                    display: 'none'
                });
            }
        }
    }
};
