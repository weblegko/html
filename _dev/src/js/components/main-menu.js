import $ from 'jquery';

import 'superfish/src/js/hoverIntent';
import 'superfish/src/js/superfish';

import "../global.js";
import NavBar from "./nav-bar";

export default class Menu {
  
  constructor(el) {
    this.el = el;
    this.root = $('.sf-menu');
    this.documentScrollTop=null;
    this.init();
  }

  init() {
    this._initSuperfish();
    this._initMobileMenu();
    this._bindEvents();
  }

  static openMenu() {
    Menu.documentScrollTop = G.getDocumentScrollTop();
    $('.drawer').addClass('opened');
    $('body').addClass('drawer-opened');
    $('body').css({
        'position': 'fixed',
        'top': -Menu.documentScrollTop
    });
    $('.drawer-scrim').css('display', 'block');
  }

  static closeMenu() {
      $('.drawer').removeClass('opened');
      $('body').removeClass('drawer-opened');
      $('body').attr('style', '');
      $('html, body').scrollTop(Menu.documentScrollTop);
      $('.drawer-scrim').css('display', 'none');
  }


  _bindEvents() {

    $('.js-close-drawer').click(function (e) {
        e.preventDefault();
        Menu.closeMenu.call(this);
        NavBar.enableUpdate();
    });

    $('.js-open-drawer').click(function (e) {
        e.preventDefault();
        if(!$(this).hasClass('is-active')) {
            NavBar.disableUpdate();
            Menu.openMenu.call(this);
        }
    });

    // // Плавная прокрутка при переходе по якорю
    // $(document).on('click', '.js-menu a', function() {
        
    //     Menu.closeMenu();
    //     NavBar.enableUpdate();

    //     let href = $.attr(this, 'href');
    //     href = href.substring(1, href.length);
    //     $('html, body').animate({
    //         scrollTop: $(href).offset().top
    //     }, 500, function () {
    //         window.location.hash = href;
    //     });
    //     return false;
    // });

  }



  
  _initSuperfish() {
    $(this.el).superfish();

    // $('#menu-icon').on('click', function() {
    //   $('#mobile_top_menu_wrapper').toggle();
    //   self.toggleMobileMenu();
    // });
  }

  _initMobileMenu() {
    
    // prestashop.on('responsive update', function(event) {
    //   $('.js-sub-menu').removeAttr('style');
    //   self.toggleMobileMenu();
    // });

    $('.js-drawer-menu-list').append($('.sf-menu').html());

    // click on menu link for open submenu
    //$('.js-drawer-menu-list .sub-menu').parent('li').find(' > a').addClass('has-submenu');
    // $('.has-submenu').on('click', function(event) {
    //     event.preventDefault();
    //     $(this).siblings('.sub-menu').slideToggle(400);
    //     $(this).toggleClass('is-sub-menu-opened');
    // });

    // click on button for open submenu
    $('.js-drawer-menu-list .sub-menu').parent('li').append('<button class="open-submenu-btn"></button>'); // add submenu buttons
    $('.open-submenu-btn').on('click', function(event) {
        event.preventDefault();
        $(this).siblings('.sub-menu').slideToggle(400);
        $(this).toggleClass('sub-menu-opened');
    });




  }

  toggleMobileMenu() {
    $('#header').toggleClass('is-open');
    if ($('#mobile_top_menu_wrapper').is(":visible")) {
      $('#notifications, #wrapper, #footer').hide();
    } else {
      $('#notifications, #wrapper, #footer').show();
    }
  }


}
