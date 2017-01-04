$(document).ready(function () {
   if ( $('.location')[0] ){
       let $mainImage:JQuery = $('.main_image'),
           $gallery:JQuery = $('.gallery'),
           $content:JQuery = $('.content');

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
   }
});

function showMoreLocationText(){
    $('.content').removeClass('excerpt');
    $('#show-more-button').remove();
}