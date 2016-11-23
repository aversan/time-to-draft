import 'jquery';
import 'tether';
import 'bootstrap/dist/js/bootstrap';
import 'uikit/dist/js/core/core';
import 'uikit/dist/js/components/sticky';
import 'swiper';
import 'owl.carousel/dist/owl.carousel';
import 'handlebars/dist/handlebars.runtime';
import 'jquery-sortable/source/js/jquery-sortable';
import MediumEditor from 'medium-editor';
import 'medium-editor-insert-plugin';
import lazyload from 'jquery-lazyload';

console.log(`app.js has loaded!`);

var swiperGamebar = new Swiper('.gamebar__container .swiper-container', {
    spaceBetween: 0,
    slidesPerView: 'auto',
    centeredSlides: false,
    loop: false,
    nextButton: '.js-gamebar-next',
    prevButton: '.js-gamebar-prev'
});

$('.slider-cards').owlCarousel({
    loop:false,
    nav:true,
    items:1
});

var EXPERTS_SLIDER = $('.slider-promo');
EXPERTS_SLIDER.owlCarousel({
    loop:true,
    nav:false,
    items:4,
    margin: 20,
    responsive: {
        0: {
            items: 1
        },
        544: {
            items: 2
        },
        960: {
            items: 4
        }
    }



});
$('.slider-promo__wrapper').on('click', '.next__arrow', function () {
    EXPERTS_SLIDER.trigger('next.owl');
});
$('.slider-promo__wrapper').on('click', '.prev__arrow', function () {
    EXPERTS_SLIDER.trigger('prev.owl');
});


$('.js-wide-slider').owlCarousel({
    loop:false,
    nav:true,
    items:3,
    mouseDrag: true,
    responsive: {
        0: {
            items: 1
        },
        544: {
            items: 2
        },
        960: {
            items: 3
        }
    }

});

$('.recommended-to-read-slider').owlCarousel({
    loop:false,
    nav:true,
    items:2,
    mouseDrag: true,
    responsive: {
        0: {
            items: 1
        },
        544: {
            items: 2
        },
        960: {
            items: 2
        }
    }

});

$('.js-tournament-slider').owlCarousel({
    loop: true,
    nav: false,
    autoWidth: true,
    items:4,
    responsive: {
        0: {
            items: 1
        },
        980: {
            items: 4
        }
    }
});

$('.js-tournament-slider__arrow__prev').on('click', function () {
    $('.js-tournament-slider').trigger('prev.owl');
});
$('.js-tournament-slider__arrow__next').on('click', function () {
    $('.js-tournament-slider').trigger('next.owl');
});

/* block for displaing notes for small size */
(function (){
    var headerNotesButton = $('.display-header-notes-js');
    var headerNavBar = $('.header__wrapper .navbar-toggleable-sm');
    var backButton = headerNavBar.find('.back-button');
    var closeButton = headerNavBar.find('.navbar-toggler');
    headerNotesButton.on('click', function () {
        headerNavBar.addClass('display-notes');
    });
    backButton.on('click', function () {
        headerNavBar.removeClass('display-notes');
    });
    closeButton.on('click', function () {
        headerNavBar.removeClass('display-notes');
    });
})();


(function(){
    var smTabComponents = $('.sm-tab-component');
    smTabComponents.each(function(i, component){
        var tabLinks = $(component).find('.tab-link');
        var tabs = $(component).find('.tab-item');
        tabLinks.each(function (i, tab) {
            $(tab).on('click', function (e) {
                e.stopPropagation();
                tabLinks.each(function (i, link) {
                    $(link).removeClass('active');
                });
                tabs.each(function (i, tab) {
                    $(tab).removeClass('active');
                });
                var tabId = e.currentTarget.dataset.tabId;
                var currentTab = [].filter.call(tabs, function (item) {
                    return item.dataset.tabId === tabId;
                })[0];
                $(e.currentTarget).addClass('active');
                $(currentTab).addClass('active');
            })
        });
    });
    var lastScrollTop = 0;
    $(window).on('scroll', function(event) {
        var st = $(this).scrollTop();
        if (st > lastScrollTop && st > 200){
            $('.js-fixed-header').removeClass('visible');
        } else if (st > 200){
            $('.js-fixed-header').addClass('visible');
        } else {
            $('.js-fixed-header').removeClass('visible');
        }
        lastScrollTop = st;
    });

    $('.site-search').each(function(){
        var $container = $(this);
        var $toggle = $container.find('.btn');
        var $menu = $('.main-menu');
        var $input = $('.site-search-input');

        $toggle.on('click', function(){
            event.preventDefault();

            $menu.toggleClass('opened-site-search');
            $input.focus();
        });
    });

    $(document).on('click', function(event) {
        if ($(event.target).closest(".site-search").length > 0) {
        } else {
            $('.main-menu').removeClass('opened-site-search');
        }
    });


    $(function () {
        var editor = new MediumEditor("#post-editor", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'quote'],
            },
            "placeholder":{
                "text":"Текст поста",
                "hideOnClick": true
            }
        });
        var mobileEditor = new MediumEditor("#mobile-post-editor", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'quote'],
                "relativeContainer": "b-medium-editor-wrapper-mobile"
            },
            "placeholder":{
                "text":"Текст поста",
                "hideOnClick": true
            }
        });
        $('.post-write .post-write__title').on('click', function () {
            $('.post-write').addClass('expanded');
        });


        $("#post-editor").mediumInsert({
            editor: editor,
            addons: {
                images: { // Image addon configuration
                    label: "<span class='icon -img-upload'></span>",
                    deleteScript: "/site/medium-editor-image-delete",
                    fileUploadOptions: {
                        url: "/site/medium-editor-image-upload?dir=blog",
                        maxFileSize: 4000000, //bytes
                        maxNumberOfFiles: 1
                    },
                    //preview: false,
                    //captions: false,
                    styles: {
                        grid: {
                            label: false
                        }
                    }
                },
                embeds: { // Embeds addon configuration
                    label: "<span class='icon -video-upload'></span>"
                }
            }
        });
        $("#mobile-post-editor").mediumInsert({
            editor: mobileEditor,
            addons: {
                images: { // Image addon configuration
                    label: "<span class='icon -img-upload'></span>",
                    deleteScript: "/site/medium-editor-image-delete",
                    fileUploadOptions: {
                        url: "/site/medium-editor-image-upload?dir=blog",
                        maxFileSize: 4000000, //bytes
                        maxNumberOfFiles: 1
                    },
                    //preview: false,
                    //captions: false,
                    styles: {
                        grid: {
                            label: false
                        }
                    }
                },
                embeds: { // Embeds addon configuration
                    label: "<span class='icon -video-upload'></span>"
                }
            }
        });
    });
    $(function () {
        var mobileMessageEditor = new MediumEditor("#mobile-message-editor-control", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor'],
                "relativeContainer": "b-medium-editor-wrapper-mobile"
            },
            "placeholder":{
                "text":"Текст сообщения",
                "hideOnClick": true
            }
        });

        $("#mobile-message-editor-control").mediumInsert({
            editor: mobileMessageEditor
        });
    });
    $(function () {
        var messageEditor = new MediumEditor("#message-editor-control", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor'],
            },
            "placeholder":{
                "text":"Текст сообщения",
                "hideOnClick": true
            }
        });

        $("#message-editor-control").mediumInsert({
            editor: messageEditor
        });
    });
})();

var POSTS_SWITCHER_SELECTOR = '#posts-switcher';
var POSTS_SWITCHER_PARENT_SELECTOR = '.posts-control';

$(POSTS_SWITCHER_SELECTOR).val($(this).is(':checked'));
$(POSTS_SWITCHER_SELECTOR).change(function() {
    if($(this).is(":checked")) {
        $(POSTS_SWITCHER_PARENT_SELECTOR).addClass("active");
    }else{
        $(POSTS_SWITCHER_PARENT_SELECTOR).removeClass("active");
    }
});

var textArea = $("#edit-area"),
    editLabel = $("#edit-label"),
    btnSave =  $("#save-edit"),
    btnBack = $("#back-edit");

textArea.hide();
btnSave.hide();
btnBack.hide();

editLabel.click(function () {
    $(this).hide();
    textArea.show();
    btnSave.show();
    btnBack.show();
    textArea.focus();
});

btnSave.click(function () {
    var text = textArea.val();
    if (text !== ''){
        editLabel.html(text + '<i class="icon -pencil"><i>');
    } else {
        editLabel.html('<i class="icon -plus-small"></i>'+
            '<em class="h6">Опишите себя</em>');
    }
    textArea.hide();
    btnSave.hide();
    btnBack.hide();
    editLabel.show();
});

btnBack.click(function () {
    textArea.hide();
    editLabel.show();
    btnSave.hide();
    btnBack.hide();
});

$('#read-more').click(function () {
    $('.short-text').hide();
    $('.long-text').show();
});
$('#read-less').click(function () {
    $('.short-text').show();
    $('.long-text').hide();
});

function checkInputsValue() {
    if ($(this).val())
        $(this).addClass('used');
    else
        $(this).removeClass('used');
};

$('.edit-profile input').each(checkInputsValue);
$('.edit-profile input').blur(checkInputsValue);


// 60fps scrolling using pointer-events: none
// https://habrahabr.ru/post/204238/

var body = document.body,
    timer;

window.addEventListener('scroll', function() {
    clearTimeout(timer);
    if(!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover')
    }

    timer = setTimeout(function(){
        body.classList.remove('disable-hover')
    },500);
}, false);


// Lazy load images

$('img.lazy, div.lazy').lazyload({
    effect: 'fadeIn'
});

$('.lazy-decor').lazyload({
    effect: 'fadeIn',
    event: 'decor'
});

$(window).on('load', function() {
    $(".lazy-decor").trigger('decor');
});