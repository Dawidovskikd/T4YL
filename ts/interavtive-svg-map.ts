window.onload=function() {
    if ( $('.loading-screen')[0] ) {



    setTimeout(function () {
        $('.loading-screen')
            .animate({
                opacity : 0
            }, 500 , () => {
                $('.loading-screen').css({
                    display: 'none'
                })
            });
    }, 1000);



    let object:any = document.getElementById("worldMapObject"),
        objectDoc:any = object.contentDocument,
        svg:any = objectDoc.childNodes[1],
        panZoom:any,
        countryInfoDiv:HTMLElement = document.getElementById('country-info'),
        pins = objectDoc.getElementsByClassName('pin'),
        $body = $('body'),
        $pins = $(pins),
        $newPins = $pins.filter((index , element) => {
            return $(element).hasClass('new');
        }),
        $oldPins = $pins.filter((index, element) => {
           return !$(element).hasClass('new');
        }),
        $countryInfoDiv:JQuery = $(countryInfoDiv),
        $locationDiv:JQuery = $('.location_info');

    // Hide pins
    hidePins($oldPins);

    // Hidden country's posts number info div
    $(svg).mousemove( (e) => {
        $countryInfoDiv
            .css({
                top: e.clientY - 15,
                left: e.clientX
            });
    });

    //SVG Pan zoom initialization
    initWorldPan();

    // On resize handlers
    $(window).resize(function(){
        panZoom.destroy();
        initWorldPan();
    });


    let paths = objectDoc.querySelectorAll('path, polygon'),
        $paths:JQuery = $(paths),
        activePins: any = $newPins;
    // var paths = document.getElementsByTagName('path');

    // Paths

    for (let i = 0, len = paths.length; i < len; i++) {

        let el = $(paths[i]);

        el.attr({
            cursor: 'pointer',
        });

        el.mouseover(function( ) {
            let self = $(this);
            // self.toFront();
            self
                .removeAttr('filter')
                .removeAttr('style');

            // Blur and add opacity to elements that are not currently hovered
            $paths
                .filter((index, element) => {
                    return element != paths[i];
                    // return collection without current element
                })
                .stop()
                .animate({
                    'opacity' : 0.8
                } , 150 )
                .attr({
                    'filter':'url(\'#blur_1\')'
                })
                ;

            // Countries with pins
            if(this.id !== ''){
                showCountryInfoBox(this.id);
            } else {
                hideCountryInfoBox();
                hidePins($oldPins);
            }
        });
        el.mouseout(function(e) {
            let targetIsPin: boolean = false,
                pathContainingPin = e.delegateTarget,
                goingTo = ( e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.parentElement ) ? e.relatedTarget.parentElement.parentElement : null ;

            let mouseleaveFromPin = function() {
                if ( e.relatedTarget != pathContainingPin){
                    onCountryLeaveFunction( e.relatedTarget , $countryInfoDiv, activePins);
                }
                $body
                    .off('mouseleave' , $(goingTo).selector , mouseleaveFromPin);
            };

            $pins.each((i, el) => {
                if ( el == goingTo ){
                    targetIsPin = true;
                }
            });

            if( !targetIsPin ){
                onCountryLeaveFunction(e.relatedTarget, $countryInfoDiv, activePins );
            } else {
                $(goingTo).mouseleave(function () {
                    $body
                        .on('mouseleave' , $(goingTo).selector , mouseleaveFromPin );
                } )
            }

        });
        el.click(function() {
        });


    }

    // Pins
    $pins
        .mouseenter(function (e) {
            let thisID = this.id.match(/\d+/)[0],
                country:string = $(this).data('country'),
                $country = $(objectDoc.getElementById(country));

            if( country !== '' ){
                $country
                    .removeAttr('filter')
                    .removeAttr('style');

                $paths
                    .filter((index, element) => {
                        return element != $country[0];
                        // return collection without pin's country
                    })
                    .stop()
                    .animate({
                        'opacity' : 0.8
                    } , 150 )
                    .attr({
                        'filter':'url(\'#blur_1\')'
                    })
                ;

            }
            hideCountryInfoBox();
            showLocationInfo(thisID , e);
        })
        .mouseleave((e) => {
            let targetIsPin: boolean = false,
                pathContainingPin = e.delegateTarget,
                goingTo = ( e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.parentElement ) ? e.relatedTarget.parentElement.parentElement : null ;

            let mouseleaveFromPin = function() {
                if ( e.relatedTarget != pathContainingPin){
                    onCountryLeaveFunction( e.relatedTarget , $countryInfoDiv, activePins);
                }
                $body
                    .off('mouseleave' , $(goingTo).selector , mouseleaveFromPin);
            };

            $pins.each((i, el) => {
                if ( el == goingTo ){
                    targetIsPin = true;
                }
            });

            if( !targetIsPin ){
                onCountryLeaveFunction(e.relatedTarget, $countryInfoDiv, activePins );
            } else {
                $(goingTo).mouseleave(function () {
                    $body
                        .on('mouseleave' , $(goingTo).selector , mouseleaveFromPin );
                } )
            }

            hideLocationInfo();
        })
        .click(function () {
            let redirect:string = window.location.protocol + '//' + window.location.hostname+ "/develop/lokacje/";
            switch (this.id.match(/\d+/)[0]) {
                //Sri Lanka
                case '228' : {
                    window.location.href = redirect + "sri_lanka.html";
                    break;
                }
                case '229' : {
                    window.location.href = redirect + "sri_lanka_2.html";
                    break;
                }
                //Genewa
                case '241' : {
                    window.location.href = redirect + "genewa.html";
                    break;
                }
                //Kluż-Napoka
                case '248' : {
                    window.location.href = redirect + "kluz_napoka.html";
                    break;
                }
                //reszta później
                default : {
                    window.location.href = redirect + "kluz_napoka.html";
                }
            }
        });

    // Blur adjusting based on zoom
    let filterBlur = objectDoc.getElementById('blur_1').children[0];

    function changeBlurValue(value: string){
        filterBlur.setAttribute('stdDeviation' , value);
    }
    function onZoomBlurValueChange(zoomValue:number){
        let newStdDeviation = 1/zoomValue;
        changeBlurValue(newStdDeviation.toString());
    }

    // utility functions

    function initWorldPan() {
        let beforePan = function(oldPan:any, newPan:any){
                let stopHorizontal = false
                    , stopVertical = false
                    , gutterWidth = window.innerWidth/2
                    , gutterHeight = window.innerHeight/2
                    // Computed variables
                    , sizes = this.getSizes()
                    , leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth
                    , rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom)
                    , topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight
                    , bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
                    , customPan = {x : 0, y : 0};
                customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
                customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
                return customPan
            },
            onZoom = function (zoomValue:number) {
                onZoomBlurValueChange(zoomValue);
            },
            eventsHandler = {
                haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
                , init: function(options:any) {
                    var instance = options.instance
                        , initialScale = 1
                        , pannedX = 0
                        , pannedY = 0;
                    // Init Hammer
                    // Listen only for pointer and touch events
                    this.hammer = new Hammer(options.svgElement, {
                        // inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
                        inputClass: Hammer.TouchInput
                    });
                    // Enable pinch
                    this.hammer.get('pinch').set({enable: true})
                    // Handle double tap
                    this.hammer.on('doubletap', function(ev:any){
                        instance.zoomIn()
                    });
                    // Handle pan
                    this.hammer.on('panstart panmove', function(ev:any){
                        // On pan start reset panned variables
                        if (ev.type === 'panstart') {
                            pannedX = 0;
                            pannedY = 0;
                        }
                        // Pan only the difference
                        instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY});
                        pannedX = ev.deltaX;
                        pannedY = ev.deltaY;
                    });
                    // Handle pinch
                    this.hammer.on('pinchstart pinchmove', function(ev:any){
                        // On pinch start remember initial zoom
                        if (ev.type === 'pinchstart') {
                            initialScale = instance.getZoom();
                            instance.zoom(initialScale * ev.scale);
                        }
                        instance.zoom(initialScale * ev.scale);
                    });
                    // Prevent moving the page on some devices when panning over SVG
                    options.svgElement.addEventListener('touchmove', function(e:any){ e.preventDefault(); });
                }
                , destroy: function(){
                    this.hammer.destroy()
                }
            };

        panZoom = svgPanZoom(svg , {
            zoomEnabled: true,
            zoomScaleSensitivity: 0.4,
            minZoom: 1.2,
            fit: true,
            center : true,
            beforePan: beforePan,
            onZoom : onZoom,
            customEventsHandler: eventsHandler
        });
    }
    function showCountryInfoBox(id:string) {
        $countryInfoDiv
            .addClass('active');

        activePins = $pins
            .filter('.' + id);

        if (activePins) {
            activePins
                .css({
                    display: 'block'
                });

            let countryBoxText:string = activePins.length;
            switch (activePins.length) {
                case 1 : {
                    countryBoxText += ' wpis';
                    break;
                }
                case 2 :
                case 3 :
                case 4 : {
                    countryBoxText += ' wpisy';
                    break;
                }
                default : {
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
    function showLocationInfo(pinID:string , mouseEvent:JQueryMouseEventObject) {

        //Check where is pin to not overlay info box
        if (mouseEvent.clientX < window.innerWidth/2){
            $locationDiv.addClass('right');
        } else {
            $locationDiv.addClass('left');
        }

        $locationDiv
            .filter((index,element) => {
                return element.id.indexOf(pinID) > -1;
            })
            .addClass('active');
    }
    function hideLocationInfo() {
        $locationDiv
            .removeClass('active left right');
    }
    function onCountryLeaveFunction(relatedTarget:Element, $countryInfoDiv:JQuery, activePins:any ) {

        let isGoingToAnotherCountry:boolean = svg == relatedTarget;

        if ( isGoingToAnotherCountry) {
            $paths
                .stop()
                .animate({
                    'opacity': 1
                }, 150, () => {
                    $paths.removeAttr('style');
                })
                .removeAttr('filter');
        }

        $countryInfoDiv
            .removeClass('active');

        hidePins(activePins.filter((index:number, element:Element) => {
            return !$(element).hasClass('new');
        }));
    }
    function hidePins(activePins:any) {
        if (activePins) {
            activePins
                .css({
                    display: 'none'
                })
        }
    }

    }
};