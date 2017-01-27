import 'jquery';
import 'tether';

//--- bootstrap ---//
import { Modal, Dropdown, Button } from "bootstrap";
import "bootstrap-modal/js/bootstrap-modal";
import "bootstrap-modal/js/bootstrap-modalmanager";
import "webui-popover";

//--- uikit ---//
import 'uikit/dist/js/core/core';
import 'uikit/dist/js/core/switcher';
import 'uikit/dist/js/components/sticky';

//--- mdl ---//
import 'material-design-lite/material'
import 'mdl-selectfield/dist/mdl-selectfield'

import 'swiper';
import 'handlebars/dist/handlebars.runtime';
import 'jquery-sortable';
import MediumEditor from 'medium-editor';
import MediumInsert from 'medium-editor-insert-plugin';
import lazyload from 'jquery-lazyload';
import 'bootstrap-touchspin';
// import FontFaceObserver from 'fontfaceobserver';
import autosize from 'autosize';
import viewport from 'responsive-toolkit';
import 'cropper';

$(() => {
    console.log(`app.js has loaded!`);

	window.MediumInsert = MediumInsert.MediumInsert;
    
    var visibilityDivs = {
        'sm': $('<div class="device-sm"></div>'),
        'md': $('<div class="device-md hidden-sm-down"></div>'),
        'lg': $('<div class="device-lg hidden-md-down"></div>')
    };

    viewport.use('Custom', visibilityDivs);

    // cropper

    $(function () {
        var $container = $('.js-post-cover');
        var $crop_image =  $container.find('.js-crop > img');
        var $range =  $container.find('.js-range-input');
        var $thumbs =  $container.find('.js-thumbs > img');
        var allow_width = 720;
        var allow_height = 365;

        $crop_image.cropper({
            aspectRatio: allow_width / allow_height,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0,
            restore: false,
            guides: false,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            zoomOnTouch: false,
            zoomOnWheel: false,
            built: function () {
                $(this).cropper('zoomTo', 0);
                var current_image = $(this).cropper('getImageData');
                var zoom_level = current_image.width / current_image.naturalWidth;
                console.log(current_image);
                $range.prop({'min': zoom_level, 'max': zoom_level + 1});
            },
            crop: function(e) {
                // Output the result data for cropping image.
                console.log('-----------------Crop Data-----------------');
                console.log('X => ', e.x);
                console.log('Y => ', e.y);
                console.log('WIDTH => ', e.width);
                console.log('HEIGHT => ', e.height);
                console.log('-----------------/Crop Data-----------------');
            }
        });

        // Change image from list
        $(document).delegate('.js-post-cover .js-thumbs > img', "click", function() {
            $crop_image.cropper('replace', $(this).attr('src'));
            var current_image = $crop_image.cropper('getImageData');
            var zoom_level = current_image.width / current_image.naturalWidth;
            $range.prop({'min': zoom_level, 'max': zoom_level + 1}).val(0);
        });

        // Zoom range
        $(document).delegate('.js-post-cover .js-range-input', 'input change', function() {
            var range_val = +$(this).val();
            console.log('ZOOM', range_val);
            $crop_image.cropper('zoomTo', range_val);
        });

        // Show modal window and reinit the cropper
        // $('#modal').on('shown.bs.modal', function () {
        //     $crop_image.cropper('replace', content_crop_images[0].src);
        //     var current_image = $crop_image.cropper('getImageData');
        //     var zoom_level = current_image.width / current_image.naturalWidth;
        //     $range.prop({'min': zoom_level, 'max': zoom_level + 1}).val(0);
        // });

        // Change image
        // $('.js-crop-replace').on('click', function () {
        //     $crop_image.cropper('replace', 'images/big.jpg');
        //     var current_image = $crop_image.cropper('getImageData');
        //     var zoom_level = current_image.width / current_image.naturalWidth;
        //     $(".js-range-input").attr({'min': zoom_level, 'max': zoom_level + 1}).val(0);
        // });

        // Crop an image
        $(".js-crop-button").on("click", function () {
            var cropped_canvas = $crop_image.cropper('getCroppedCanvas');
            // $(".js-crop-result").html(cropped_canvas);
            console.log(cropped_canvas);
            //console.log(cropped_canvas.toDataURL());
        });

        $crop_image.on('zoom.cropper', function (e) {
            console.log('Ratio =>', e.ratio);
            console.log('Old ratio => ', e.oldRatio);
        });

    });

    // set col section height

    var $colSection = $('.col-section');
    var $colSide = $colSection.find('.col-side');

    $(window).resize(function() {
        var h = $colSide.height();
        $colSection.css('min-height', h);
    }).trigger('resize');

    // gamebar

    var swiperGamebar = new Swiper('.gamebar__container .swiper-container', {
        spaceBetween: 0,
        slidesPerView: 'auto',
        centeredSlides: false,
        loop: false,
        nextButton: '.js-gamebar-next',
        prevButton: '.js-gamebar-prev'
    });

    // slider plays

    $('.js-swiper-slider-plays').each(function(){
        var $wrapper = $(this);
        var $swiperContainer = $wrapper.find('.js-swiper-container');
        var $prev = $wrapper.find('.js-swiper-prev');
        var $next = $wrapper.find('.js-swiper-next');
        var $pagination = $wrapper.find('.js-swiper-pagination');

        new Swiper($swiperContainer, {
            loop: false,
            prevButton: $prev,
            nextButton: $next,
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 0,
            pagination: $pagination,
            paginationClickable: true,
            observer: true,
            observeParents: true,
            autoHeight: true,
            breakpoints: {
                1248: {
                    slidesPerView: 3,
                    slidesPerGroup: 3
                },
                960: {
                    slidesPerView: 1,
                    slidesPerGroup: 1
                }
            },
            onInit: function(swiper) {
                $(window).resize(viewport.changed(function(){
                    $wrapper = $(swiper.wrapper[0]);
                    $wrapper.height('auto');
                    var maxHeight = Math.max.apply(Math, $wrapper.find('.swiper-slide').map(function(){
                        return $(this).height();
                    }));
                    $wrapper.css('min-height', maxHeight);
                    swiper.update();
                }));
            }
        });
    });

    // slider plays wide

    $('.js-swiper-slider-plays-wide').each(function(){
        var $wrapper = $(this);
        var $swiperContainer = $wrapper.find('.js-swiper-container');
        var $prev = $wrapper.find('.js-swiper-prev');
        var $next = $wrapper.find('.js-swiper-next');
        var $pagination = $wrapper.find('.js-swiper-pagination');

        new Swiper($swiperContainer, {
            loop: false,
            prevButton: $prev,
            nextButton: $next,
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 0,
            pagination: $pagination,
            paginationClickable: true,
            observer: true,
            observeParents: true,
            autoHeight: true,
            breakpoints: {
                1248: {
                    slidesPerView: 3,
                    slidesPerGroup: 3
                },
                960: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    slidesPerColumn: 3,
                    autoHeight: false
                }
            },
            onInit: function(swiper) {
                $(window).resize(viewport.changed(function(){
                    $wrapper = $(swiper.wrapper[0]);
                    $wrapper.height('auto');
                    var maxHeight = Math.max.apply(Math, $wrapper.find('.swiper-slide').map(function(){
                        return $(this).height();
                    }));
                    $wrapper.css('min-height', maxHeight);
                    swiper.update();
                }));
            }
        });
    });

    // swiper tutorial

    $('.js-swiper-tutorial').each(function(){
        var $wrapper = $(this);
        var $swiperContainer = $wrapper.find('.js-swiper-container');
        var $next = $wrapper.find('.js-swiper-next');
        var $pagination = $wrapper.find('.js-swiper-pagination');

        var swiper = new Swiper($swiperContainer, {
            loop: false,
            nextButton: $next,
            slidesPerView: 1,
            spaceBetween: 0,
            pagination: $pagination,
            paginationClickable: true,
            observer: true,
            observeParents: true
        });
    });

    // swiper news

    $('.js-swiper-news').each(function(){
        var $wrapper = $(this);
        var $swiperContainer = $wrapper.find('.js-swiper-container');
        var $prev = $wrapper.find('.js-swiper-prev');
        var $next = $wrapper.find('.js-swiper-next');

        new Swiper($swiperContainer, {
            loop: false,
            prevButton: $prev,
            nextButton: $next,
            slidesPerView: 3,
            slidesPerGroup: 3,
            slidesPerColumn: 2,
            spaceBetween: 20,
            breakpoints: {
                1248: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    slidesPerColumn: 2,
                    spaceBetween: 20
                },
                960: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    slidesPerColumn: 3,
                    spaceBetween: 16
                }
            }        
        });
    });

    // panel recommended-posts

    $('.js-swiper-recommended-posts').each(function(){
        var $wrapper = $(this);
        var $swiperContainer = $wrapper.find('.js-swiper-container');
        var $prev = $wrapper.find('.js-swiper-prev');
        var $next = $wrapper.find('.js-swiper-next');

        new Swiper($swiperContainer, {
            loop: false,
            prevButton: $prev,
            nextButton: $next,
            spaceBetween: 20,
            slidesPerView: 2,
            slidesPerGroup: 2,
            slidesPerColumn: 2,
            breakpoints: {
                1248: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    slidesPerColumn: 2,
                    spaceBetween: 20
                },
                960: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    slidesPerColumn: 4,
                    spaceBetween: 16
                }
            }        
        });
    });

    // slider wide

    $('.js-swiper-slider-wide').each(function(){
        var $wrapper = $(this);
        var $swiperContainer = $wrapper.find('.js-swiper-container');
        var $prev = $wrapper.find('.js-swiper-prev');
        var $next = $wrapper.find('.js-swiper-next');
        var $pagination = $wrapper.find('.js-swiper-pagination');

        var swiper = new Swiper($swiperContainer, {
            loop: false,
            prevButton: $prev,
            nextButton: $next,
            spaceBetween: 20,
            slidesPerView: 4,
            slidesPerGroup: 4,
            pagination: $pagination,
            paginationClickable: true,
            autoHeight: true,
            centeredSlides: false,
            breakpoints: {
                1248: {
                    slidesPerView: 'auto',
                    slidesPerGroup: 1,
                    scrollbarHide: true,
                    spaceBetween: 20,
                    grabCursor: true,
                    freeMode: true
                },
                960: {
                    slidesPerView: 'auto',
                    slidesPerGroup: 1,
                    spaceBetween: 16,
                    grabCursor: true,
                    freeMode: true
                }
            }        
        });
    });

    // slider cards

    $('.js-swiper-slider-cards').each(function(){
        var $wrapper = $(this);
        var $swiperContainer = $wrapper.find('.js-swiper-container');
        var $prev = $wrapper.find('.js-swiper-prev');
        var $next = $wrapper.find('.js-swiper-next');
        var $pagination = $wrapper.find('.js-swiper-pagination');
        var $iconsContainer = $wrapper.find('.js-swiper-icons');

        var swiper = new Swiper($swiperContainer, {
            loop: false,
            prevButton: $prev,
            nextButton: $next,
            spaceBetween: 20,
            slidesPerView: 1,
            pagination: $pagination,
            paginationClickable: true,
            960: {
                spaceBetween: 16
            }
        });

        swiper.on('slideChangeStart', function(swiper){
            var $iconsOut = $iconsContainer.find('.card-icons');
            var $iconsIn = $swiperContainer.find('.swiper-slide-active .slider-cards__item-icons .card-icons').clone();

            $iconsIn.hide().appendTo($iconsContainer);
            $iconsOut.fadeOut(300, function(){
                $iconsOut.remove();
            });
            $iconsIn.fadeIn(300);
        });
    });

    // tabs scroller

    new Swiper('.js-swiper-container-tabs', {
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: true,
        slidesPerView: 'auto',
        mousewheelControl: false,
        freeMode: true,
        centeredSlides: false,
        grabCursor: true,
        observer: true,
        observeParents: true,
        onInit: function(swiper) {
            var $container = $(swiper.container[0]);
            var $slides = $container.find('.swiper-slide');

            $container.hover(function(){
                var sumWidth = 0;
                $slides.each(function(){
                    sumWidth += $(this).width();
                });
                
                if (sumWidth > $container.width()) {
                    swiper.params.followFinger = true;
                } else {
                    swiper.params.followFinger = false;
                }
            }, function(){});
        }
    });

    // scroller

    new Swiper('.js-swiper-container-scrollable', {
        scrollbar: '.swiper-scrollbar',
        direction: 'vertical',
        slidesPerView: 'auto',
        mousewheelControl: true,
        freeMode: true,
        observer: true,
        observeParents: true,
        scrollbarDraggable: false
    });

    (function(){
        $('.js-header').each(function(){
            var $html = $('html');
            
            var $container = $(this);
            var $search_toggler = $container.find('.js-search-toggle');
            var $search = $container.find('.js-search');
            var $toggler = $container.find('.js-toggler'); 
            var $collapse = $container.find('.js-collapse');
            var $close = $container.find('.js-close'); 

            var $notes_container = $('.js-header-notes');
            var $notes_toggler = $container.find('.js-header-notes-toggler');
            var $notes_collapse = $notes_container.find('.js-collapse');
            var $notes_close = $notes_container.find('.js-close');
            var $notes_prev = $notes_container.find('.js-prev');

            // toggle main

            $toggler.on('click', function(){
                if ($collapse.hasClass('in')) {
                    $collapse.removeClass('in');
                    $container.removeClass('is-collapse-open');
                    $html.removeClass('page-overflow');
                } else {
                    $collapse.addClass('in');
                    $container.addClass('is-collapse-open');
                    $html.addClass('page-overflow');
                }
            });

            // toggle notes

            $notes_toggler.on('click', function(){
                if (!$notes_container.hasClass('is-open')) {
                    $notes_container.addClass('is-open');
                    $notes_collapse.addClass('in');
                    $notes_collapse.addClass('is-collapse-open');
                } else {
                    $notes_container.removeClass('is-open');
                    $notes_collapse.removeClass('in');
                    $notes_collapse.removeClass('is-collapse-open');
                }
            });

            // prev

            $notes_prev.on('click', function(){
                $notes_container.removeClass('is-open');
            });

            // close

            $close.on('click', function(){
                $collapse.removeClass('in');
            });

            $notes_close.on('click', function(){
                $notes_collapse.removeClass('in');
            });

            $notes_close.on('click', function(){
                $collapse.removeClass('in');
                $notes_container.removeClass('is-open');
                $notes_collapse.removeClass('in');
                $notes_collapse.removeClass('is-collapse-open');
            });

            $close.add($notes_close).on('click', function(){
                $html.removeClass('page-overflow');
            });

            // search

            $search_toggler.on('click', function(){
                if (!$container.hasClass('is-search-open')) {
                    $container.addClass('is-search-open');
                } else {
                    $container.removeClass('is-search-open');
                }
            });

            $(document).on('click', function(event) {
                if ($(event.target).closest($search).length > 0) {
                } else {
                    $container.removeClass('is-search-open');
                }
            });
        })

        // editor write

        $('.editor-write__title').on('click', function () {
            $(this).parents('.editor-write').addClass('is-expanded');
        });

        // Medium Editors

        // modal message editor

        $(function () {
            var desktopMessageEditor = new MediumEditor("#desktop-message-editor", {
                "toolbar":{
                    "buttons": ['bold', 'italic', 'underline', 'anchor']
                }
            });

            var mobileMessageEditor = new MediumEditor("#mobile-message-editor", {
                "toolbar":{
                    "buttons": ['bold', 'italic', 'underline', 'anchor'],
                    relativeContainer: document.getElementById('mobile-message-editor-toolbar')
                }
            });
        });

        // message editor

        $(function () {
            var desktopMessageEditor = new MediumEditor("#desktop-message-editor", {
                "toolbar":{
                    "buttons": ['bold', 'italic', 'underline', 'anchor']
                }
            });

            var mobileMessageEditor = new MediumEditor("#mobile-message-editor", {
                "toolbar":{
                    "buttons": ['bold', 'italic', 'underline', 'anchor'],
                    relativeContainer: document.getElementById('mobile-message-editor-toolbar')
                }
            });
        });

        // post editor

        var desktopPostEditor = new MediumEditor("#desktop-post-editor", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'quote'],
            }
        });

        var mobilePostEditor = new MediumEditor("#mobile-post-editor", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'quote'],
                relativeContainer: document.getElementById('mobile-post-editor-toolbar')
            }
        });

        $("#desktop-post-editor").mediumInsert({
            editor: desktopPostEditor,
            addons: {
                images: { // Image addon configuration
                    label: '<span class="sprite -img-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#img-upload"></use></svg></span>',
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
                    label: '<span class="sprite -video-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#video-upload"></use></svg></span>'
                }
            }
        });

        $("#mobile-post-editor").mediumInsert({
            editor: mobilePostEditor,
            addons: {
                images: { // Image addon configuration
                    label: '<span class="sprite -img-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#img-upload"></use></svg></span>',
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
                    label: '<span class="sprite -video-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#video-upload"></use></svg></span>'
                }
            }
        });

        // full post editor

        var desktopFullPostEditor = new MediumEditor("#desktop-full-post-editor", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'quote'],
            }
        });

        var mobileFullPostEditor = new MediumEditor("#mobile-full-post-editor", {
            "toolbar":{
                "buttons": ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'quote'],
                relativeContainer: document.getElementById('mobile-full-post-editor-toolbar')
            }
        });

        $("#desktop-full-post-editor").mediumInsert({
            editor: desktopFullPostEditor,
            addons: {
                images: { // Image addon configuration
                    label: '<span class="sprite -img-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#img-upload"></use></svg></span>',
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
                    label: '<span class="sprite -video-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#video-upload"></use></svg></span>'
                }
            }
        });

        $("#mobile-full-post-editor").mediumInsert({
            editor: mobileFullPostEditor,
            addons: {
                images: { // Image addon configuration
                    label: '<span class="sprite -img-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#img-upload"></use></svg></span>',
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
                    label: '<span class="sprite -video-upload icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#video-upload"></use></svg></span>'
                }
            }
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

    $(POSTS_SWITCHER_SELECTOR).on('change', function(){
    	var $popover = $(POSTS_SWITCHER_SELECTOR).next('.js-popover-lenta');
    	
    	if($popover.data('popover-counter') == 0 && $(this).is(":checked")) {
    		$popover.webuiPopover({
    			style: 'info',
    			width: '320px',
    			closeable: false,
    			trigger: 'manual',
    			padding: false,
    			container: '.posts-control__switcher__item',
    			onShow: function($el){
    				$popover.data('popover-counter', $popover.data('popover-counter') + 1);	
    			}
    		});

    		$('.js-popover-lenta-close')
    			.on('click', function(){
    				$popover.webuiPopover('hide');
    				return false;
    			});

    		$popover.webuiPopover('show');
    	} else {
    		$popover.webuiPopover('hide')
    	}
    });

    $('[data-webui-popover]').webuiPopover();

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
        if (text !== '') {
            editLabel.html(text + '<i class="icon -pencil"><i>');
        } else {
            editLabel.html('<span class="sprite -plus-circle icon"><svg viewBox="0 0 1 1"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/icons.svg#plus-circle"></use></svg></span>'+
                '<em class="typo--h6 typo--italic">Опишите себя</em>');
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

    // fontface observer

    // $(function(){
    // 	var roboto400 = new FontFaceObserver("Roboto", {
    // 	  weight: 400
    // 	});

    // 	var roboto500 = new FontFaceObserver("Roboto", {
    // 	  weight: 500
    // 	});

    // 	var roboto700 = new FontFaceObserver("Roboto", {
    // 	  weight: 700
    // 	});

    // 	var roboto900 = new FontFaceObserver("Roboto", {
    // 	  weight: 900
    // 	});

    // 	var exo = new FontFaceObserver("Exo 2", {
    // 	});

    // 	Promise.all([
    // 	  roboto400.load(),
    // 	  roboto500.load(),
    // 	  roboto700.load(),
    // 	  roboto900.load(),
    // 	  exo.load()
    // 	]).then(function() {
    // 	  document.documentElement.className += " fonts-loaded";
    // 	  console.log(`all fonts loaded`);
    // 	}, function() {
    // 	  document.documentElement.className += " fonts-unavailable";
    // 	});	
    // });

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

    // vote

    $(".js-comment-vote")
        .TouchSpin({
            min: -10000,
            max: 10000,
            step: 1,
            buttondown_class: "btn btn-link",
            buttonup_class: "btn btn-link",
            mousewheel: false,
            boostat: 1,
            booster: false
        })
        .on('change', function(){
            var val = parseInt($(this).val());
            
            if(val >= 0) {
                $(this).removeClass('is-negative').addClass('is-positive');
            } else {
                $(this).removeClass('is-positive').addClass('is-negative');
            }
        })
        .trigger('change');

    // modal
    $('.modal--alt')
        .on('show', function(event) {
            $('body').addClass('modal-open-alt');
        })
        .on('hidden', function(event){
            $('body').removeClass('modal-open-alt');
        });

    // autosize textarea

    autosize($('textarea.js-autosize'));

    $('[data-uk-switcher]').on('show.uk.switcher', function(event, area) {
        $(area).siblings().removeClass('uk-active is-active').end().removeClass('uk-active').addClass('is-active');  
        $($(this).data('connect')).each(function(){
          $(this).children().eq( $(area).data('uk-switcher-item') ).siblings().removeClass('uk-active is-active').end().removeClass('uk-active').addClass('is-active');  
        })
    });

    $('.js-playgroud-review-toggle').one('click', function(){
        $(this).parents('.playground-review__footer').prop('hidden', true);
    });

    $(function(){
        var $header = $('.navbar--header');
        
        $(window).on('scroll resize', function(){
            if ($header.offset().top <= 0) {
                $header.addClass('is-top');
            } else {
                $header.removeClass('is-top');
            }
        });
    });
});