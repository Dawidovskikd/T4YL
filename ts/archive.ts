$(document).ready(function () {
    if ( $('.location')[0] ){
        let $mainImage:JQuery = $('.main_image'),
            $gallery:JQuery = $('.gallery'),
            $content:JQuery = $('.content'),
            $contentParagraphs:JQuery = $content.children();

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
        trunkLastParagraph()

        function trunkLastParagraph(){
            let containerHeight = $content.height(),
                currentOffset = 0;


            console.log(containerHeight);
            for ( let i = 0 ; i < $contentParagraphs.length ; i++){
                currentOffset += $contentParagraphs[i].clientHeight;
                console.log(currentOffset);
                if ( currentOffset > containerHeight){
                    let delta = currentOffset - containerHeight;
                    $($contentParagraphs[i])
                        .height( Math.floor( ( $contentParagraphs[i].clientHeight - delta) / 14 ) * 14 )
                        .css({
                            'padding-bottom' : 0,
                            'margin-bottom' : '10px',
                            'overflow' : 'hidden'
                        });
                    console.log('Last paragraph');
                    break;
                }
            }
        }

    }

});
function showMoreLocationText(){
    $('.content')
        .removeClass('excerpt')
        .children()
        .removeAttr('style');
    $('#show-more-button').remove();
}


