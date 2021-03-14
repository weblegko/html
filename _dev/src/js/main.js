// import "matchmedia-polyfill";
// import "matchmedia-polyfill/matchMedia.addListener";

//import objectFitImages from "object-fit-images";

import "lazysizes";

//import {MDCRipple} from '@material/ripple';
// import {MDCTextField} from '@material/textfield';

import Lightbox from "./components/lightbox";
import Slider from "./components/slider";
import ScrollToTopBtn from "./components/scrolltotop-btn";
import MainMenu from './components/main-menu';
import NavBar from "./components/nav-bar";
import "./M/parallax";
import ymaps from 'ymaps';

class Application {

    constructor() {
        this.initCommon();
        //this.initMaterialDesignStuff();
        this.initSliders();
        //this.initAjaxBlogLoad();
        this.initMobileViewPortHeight();
        this.initYandexMap();
    }


    // initMaterialDesignStuff() {
    //     // еффект ripple на кнопках        
    //     [].map.call(document.querySelectorAll('.mdc-button'), function(el) {
    //         return new MDCRipple(el);
    //     });

    //     // текстовые поля форм
    //     // [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
    //     //     return new MDCTextField(el);
    //     // });
    // }
    
    
    // Инициализации
    initCommon() {

        new Lightbox();

        new ScrollToTopBtn();

        new NavBar({offsetForFixed: 300});

        new MainMenu('ul.sf-menu');

        $('.parallax').parallax();
        
        
        //console.log('history', history);


        /* Нажали на кнопочку отправки формы обьратной связи*/
        $('#zayavka-button').click(function(event) {
            event.preventDefault();
            $('#zayvka-submit').trigger('click');
        });


        if( (history.length == 0) && !document.referrer ) {
            $('.js-go-back').hide();
        }  


        // прокрутить вниз первый экран
        $('.js-go-back').click(function (e) {
            e.preventDefault();
            if( (1 < history.length) && document.referrer ) {
                history.back();
            }
        });


        // $('.js-toggle-search-box').click(function (e) {
        //     e.preventDefault();
        //     let $this = $(this);
        //     if ($this.hasClass('active')) {
        //         $this.removeClass('active');
        //         $('.search-box').hide();
        //         //$this.text('Поиск');
        //     } else {
        //         $this.addClass('active');
        //         $('.search-box').show();
        //         //$this.text('Скрыть');
        //     }
        // });
        

        //objectFitImages
        if (typeof objectFitImages === 'function') {
            objectFitImages($('.image-cover img'));
            
        }

        
        // прокрутить вниз первый экран
        $('.js-go-down').click(function (e) {
            e.preventDefault();
            let y = $('.header-wrap').height();
            $("html, body").animate(
                { scrollTop: y }, 1000);
        });



        // // Плавная прокрутка при переходе по якорю
        // const $root = $('html, body');
        // $('#main-menu a').click(function() {
        //     var href = $.attr(this, 'href');
        //     href = href.substring(1, href.length);
        //     //console.log(href);
        //     $root.animate({
        //         scrollTop: $(href).offset().top
        //     }, 1500, function () {
        //         window.location.hash = href;
        //     });
        //     return false;
        // });
        
    }



    initYandexMap() {

        ymaps.load('https://api-maps.yandex.ru/2.1/?lang=ru_RU')
            .then(maps => {
                
                // Создание карты.
                // https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/map-docpage/
                const myMap = new maps.Map('yandex-map', {
                    center: [51.660781, 39.200269],
                    zoom: 13,
                });

                // myMap.controls // добавим всяких кнопок, в скобках их позиции в блоке
                //         .add('zoomControl', { left: 5, top: 5 }) //Масштаб
                //         .add('typeSelector') //Список типов карты
                //         .add('mapTools', { left: 35, top: 5 }) // Стандартный набор кнопок
                //         .add('searchControl'); // Строка с поиском

                // Добавление метки
                // https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark-docpage/
                

                /* Создаем кастомные метки */
                const myPlacemark0 = new maps.Placemark([51.660781, 39.200269], { 
                        // Хинт показывается при наведении мышкой на иконку метки.
                        hintContent: 'Содержимое всплывающей подсказки',
                        // Балун откроется при клике по метке.
                        balloonContent: '<div class="ballon">Содержимое балуна</div>', // сдесь содержимое балуна в формате html, все стили в css
                        
                        iconImageHref: '/img/marker.svg', // картинка иконки
                        iconImageSize: [40, 40], // размер иконки
                        iconImageOffset: [-32, -64], // позиция иконки
                    });
                    
                    // тоже самое для других меток

        
                // После того как метка была создана, добавляем её на карту.
                myMap.geoObjects.add(myPlacemark0);


                // Фикс кривого выравнивания кастомных балунов
                myMap.geoObjects.events.add([
                    'balloonopen'
                ], function (e) {
                    var geoObject = e.get('target');
                    myMap.panTo(geoObject.geometry.getCoordinates(), { delay: 0 });
                });

            })
            .catch(error => console.log('Не удалось загрузить карту', error));

    }


    initAjaxBlogLoad() {
  
        $('#load-more').click(function(event){
            event.preventDefault();

            console.log('Load more posts');
            
            const $but = $(this);

            if($but.attr('disabled') != 'disabled') {

                $but.attr("disabled", true).find('.text').html("<i class='icon-spin spin'></i>Загрузка..."); // изменяем текст кнопки, вы также можете добавить прелоадер
                const data = {
                    'action': 'loadmore',
                    'query': true_posts,
                    'page' : current_page
                };
                $.ajax({
                    url:ajaxurl, // обработчик
                    data:data, // данные
                    type:'POST', // тип запроса
                    success:function(data){
                    if( data ) {
                        $('#load-more-wrp').before(data).find('.text').html("<i class=' icon-spin'></i>Ещё записи дневника"); // вставляем новые посты
                        $but.attr("disabled", false);
                        current_page++; // увеличиваем номер страницы на единицу
                        if (current_page == max_pages) $("#load-more-wrp").remove(); // если последняя страница, удаляем кнопку
                    } else {
                        $('#load-more-wrp').remove(); // если мы дошли до последней страницы постов, скроем кнопку
                    }
                    }
                });

            } //if not disabled

        });
    }


  
    // Инициализация всех слайдеров
    initSliders() {

        // Home Slider
        let $homeSlider = $('.home-slider');
        if ($homeSlider.length !== 0) {
            new Slider($homeSlider, {
                counter: false,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: false,
                fade: true,
                arrows: true,
                //dots: true,
                autoplay: true,
                //autoplaySpeed: 2000,

                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 1,
                        }
                    },

                    {
                        breakpoint: 766,
                        settings: {
                            slidesToShow: 1,
                            arrows: false
                        }
                    },
                ]


            });
        }


        // Post carousel (home page)
        let $postCarousel = $('.post-carousel');
        if ($postCarousel.length !== 0) {
            new Slider($postCarousel, {
                counter: false,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                adaptiveHeight: false,
                fade: false,
                arrows: true,
                //dots: true,
                autoplay: true,
                //autoplaySpeed: 2000,
                 
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                        }
                    },

                    {
                        breakpoint: 766,
                        settings: {
                            slidesToShow: 2,
                            arrows: false
                        }
                    },
                ]
            });
        }

        

        // Slider in content
        let $slider = $('.slider');
        if ($slider.length !== 0) {
            new Slider($slider, {
                counter: false,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: true,
                             
            });
        }
        
        
        // Carousel in content
        let $carousel = $('.carousel');
        if ($carousel.length !== 0) {
            new Slider($carousel, {
                counter: false,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,                
                arrows: true,
                prevArrow: '<button class="carousel-prev"><span class="icon-left"></span></button>',
                nextArrow: '<button class="carousel-next"><span class="icon-right"></span></button>',
                adaptiveHeight: true,                
                
                responsive: [
                   
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 2,
                            arrows: false
                        }
                    },
                ]
            });
        }
    }


     // кастыльное решение 100vh для мобильников
    initMobileViewPortHeight() {
        // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        let document_width = window.innerWidth; 
        
        // We listen to the resize event (а ресайз в мобилках срабатывает и при скроле, когда исчезает строка ввода адреса в браузере)
        window.addEventListener('resize', () => {
                                    
            // We execute the same script as before
                if (document_width != window.innerWidth) {

                    // console.log('document_width=', document_width);
                    // console.log('window.innerWidth=', window.innerWidth);

                    document_width = window.innerWidth; 
                    let vh = window.innerHeight * 0.01;                    
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                }
        });
    }

    
}


// запуск приложения
$(() => {
    new Application();
});