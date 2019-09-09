$(function () {

    $('.sliderTop').owlCarousel({
          loop: false,
          items: 1,
          dots: false,
           onChanged: callbackTop
    });
    $('.barbersSlider').owlCarousel({
          loop: false,
          items: 1,
          dots: false,
          nav: true,
          navText: [ '&larr; Prev', 'Next &rarr;'],
          slideBy: 5,
          onChanged: callbackBarber,
          responsive: {

              768: {
                items: 3
              },
              1024: {
                items: 4
              },
              1199: {
                  items: 5,
              }
          }
    });


    function callbackTop(event) {

        var items     = event.item.count;     // Number of items
        var item      = event.item.index;     // Position of the current item
        var headerSliderCurrent = document.querySelector('.headerCountSlide__text_cur');
        var headerSliderAll = document.querySelector('.headerCountSlide__text_all');

        headerSliderCurrent.innerText = item+1;
        headerSliderAll.innerText = items;
    }

    function callbackBarber(event) {

        var items     = event.item.count;     // Number of items
        var item      = event.item.index;     // Position of the current item
        var size      = event.page.size;      // Number of items per page
        var barberSliderCurrent = document.querySelector('.barbersCounter__text_cur');
        var barberSliderAll = document.querySelector('.barbersCounter__text_all');

        barberSliderCurrent.innerText = item + size;
        barberSliderAll.innerText = items;
    }


    /* header menu toggling */
    var mobileMenuButton = $('.headerSidebar__button');
    var mobileMenu = $('.headerTop');

    if (mobileMenuButton.css('position') === 'fixed') {

        mobileMenuButton.click(function () {
            if (mobileMenu.hasClass('menuClosed')) {
                mobileMenu.removeClass('menuClosed');
            }
            mobileMenu.toggleClass('menuShow');
            if (mobileMenu.hasClass('menuShow')) {
                var closeMenu = $('.menuClose');
                closeMenu.click(function (event) {
                    event.preventDefault();
                    mobileMenu.removeClass('menuShow').addClass('menuClosed');
                });
            }
        });
    }

    /* toggling social buttons  */

    var socialButton = $('.headerSidebar__social');
    var socialIcons = $('.headerSidebar__socialList');
    if (socialIcons.css('position', 'absolute')) {
        socialIcons.addClass('socialIconsClosed');
        socialButton.click(function (event) {
            event.stopPropagation();
            if (socialIcons.hasClass('socialIconsClosed')) {
                socialIcons.removeClass('socialIconsClosed').addClass('socialIconsShow');
            } else if (socialIcons.hasClass('socialIconsShow')) {
                socialIcons.removeClass('socialIconsShow').addClass('socialIconsClosed');
            }


        });
        if (socialIcons.hasClass('socialIconsShow')) {
            var socialIcon = $('.headerSidebar__socialList li');
            socialIcon.click(function () {
                socialIcons.removeClass('socialIconsShow').addClass('socialIconsClosed');
            });
        }
    }

    /* custom scrollbar init */
    // $('.headerSidebar__scroller').mCustomScrollbar({
    //     axis:   'y',
    //     // setWidth: 50,
    //     // setHeight: 100,
    //     theme:"dark"
    // });
    // $(window).on("load",function(){
    //         $(".headerSidebar__scroller").mCustomScrollbar({
    //           axis:"y",
    //           theme:"dark-3"
    //
    //         });
    //     });


    /*  toggling tabs on main page  */
    var pricesTabs = $('.pricesTabs');
    if (pricesTabs) {
        var tabTitle = $('.pricesTabs__title');
        var tabItem = $('.pricesTabsItem');
        var tabList = $('.pricesTabs__list');
        tabTitle.click(function () {
            $(this).parent().parent('.pricesTabs__list').find('.pricesTabs__title').removeClass('activeTabTitle');
            $(this).addClass('activeTabTitle');
            var tabs = document.querySelector('.pricesTabs__list');
            var tabsItems = document.querySelectorAll('.pricesTabsItem');
            var tabsChildren = tabs.children;
            var childItem;
            var index = null;
            var tabsItemsIndex = null;
            for (var i = 0; i < tabsChildren.length; i++) {
                childItem = tabsChildren[i].children;
                if (tabsItems[i].classList.contains('activeTab')) {
                    tabsItemsIndex = i;
                    tabsItems[i].classList.remove('activeTab');
                }
                index =i;
                for (var k = 0; k < childItem.length; k++) {
                    if (childItem[k].classList.contains('activeTabTitle')) {
                        tabsItems[index].classList.add('activeTab');
                    }
                }
            }
        });
    }

    /*  init masonry gallery on Home page  */
    var galleryHome = $('#gallery-home');
    var galleryItemWidth = '.size25p';
    galleryHome.imagesLoaded(function () {
        galleryHome.masonry({
            itemSelector: '.item-masonry',
            columnWidth: galleryItemWidth,
            percentPosition: true,
            fitWidth: true,
            // horizontalOrder: true
            gutter: 10
        });
    });

    /* toggling phone numbers in header */
    var phones = $('.headerCallback__phones');
    var arrowDown = $('.arrowDown');
    var headerCallbackButton = $('.headerCallback__button');
    var currPhoneNum;
    arrowDown.click(function () {
        phones.toggleClass('phonesOpen');
        phones.find($('.headerCallback__phone_hidden')).fadeToggle('fast');
        $('.headerCallback__phone').click(function () {
            $('.headerCallback__phone').removeClass('headerCallback__phone_selected');
            $('.headerCallback__phone').addClass('headerCallback__phone_hidden');
            $(this).toggleClass('headerCallback__phone_hidden').toggleClass('headerCallback__phone_selected');
            currPhoneNum = $(this).html();
            headerCallbackButton.attr('href', 'tel:+380' + currPhoneNum);
            $('.headerCallback__phone_hidden').fadeOut('fast');
            phones.removeClass('phonesOpen');
        });
    });

    /* scroll down button  */

    if ($('.scrollDownButton').length) {

        var navLink = $('.scrollDownButton');
        navLink.click(function (event) {
            event.preventDefault();
            var scroll_el = $(this).attr('href');
            if (scroll_el.length != 0) {
            $('html, body').animate({ scrollTop: $(scroll_el).offset().top}, 500);
                }
               return false;
        });
    }

    /* contact form popup init */

        var appoitmentButton = $('.appoitmentButton'),
            overlay = $('#overlay'),
            wrapper = $('.wrapper'),
            contactForm = $('.contactFormWrapper');


    if (appoitmentButton) {
        appoitmentButton.click(function (event) {
            event.preventDefault();
            showFormFixed();
        });
    }
    function hideFormFixed() {
        // $('.wrapper .contactFormWrapper.formFixed').removeClass('formFixed');
        $('.contactFormWrapper.formFixed').remove();
       overlay.fadeOut('slow');
   }

   function showFormFixed() {

       contactForm.clone().toggleClass('formFixed').appendTo(wrapper);
       overlay.fadeIn('slow');
       var closeButton = $('.contactFormWrapper.formFixed a.icon-close');
       closeButton.click(function (event) {
           event.preventDefault();
           hideFormFixed();
       });
   }

   function hideForm() {
       contactForm.fadeOut('slow');
   }

   overlay.click(function () {
       hideFormFixed();
   });


});
