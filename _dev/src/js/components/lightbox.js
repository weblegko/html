import "@fancyapps/fancybox";
import Component from "./component";

export default class Lightbox extends Component {
    get _defaultOptions() {
        return {
            defaults: {
                lang: 'ru',
                transitionEffect: 'slide',
                backFocus: false,
                buttons: [
                    'close'
                ],
                i18n: {
                    ru: {
                        CLOSE: 'Закрыть',
                        NEXT: 'Дальше',
                        PREV: 'Назад',
                        ERROR: 'Не удается загрузить. <br/> Попробуйте позднее.',
                        PLAY_START: 'Начать слайдшоу',
                        PLAY_STOP: 'Остановить слайдшоу',
                        FULL_SCREEN: 'На весь экран',
                        THUMBS: 'Превью',
                        DOWNLOAD: 'Скачать',
                        SHARE: 'Поделиться',
                        ZOOM: 'Увеличить'
                    }
                }
            }
        }
    }

    constructor(root, options) {
        super(root, options);

        this.initialize();
    }

    initialize() {
        super.initialize();
    }

    _cacheNodes() {
        this.nodes = {
            link: $('.js-link-modal')
        };
    }

    _bindEvents() {
        this.nodes.link.on('click', event => {
            event.preventDefault();

            let $link = $(event.currentTarget);

            $.fancybox.open({
                src: $link.data('src'),
                type: 'inline',
                opts: {
                    touch: false,
                    autoFocus: false,
                    closeExisting: true,
                    animationEffect: false,
                    beforeLoad: event => {
                        event.current.$slide.addClass('fancybox-modal');
                    }
                }
            });
        });
    }

    _ready() {
        $.fancybox.defaults.i18n.ru = this.options.defaults.i18n.ru;
        $.fancybox.defaults.lang = this.options.defaults.lang;
        $.fancybox.defaults.buttons = this.options.defaults.buttons;
        $.fancybox.defaults.transitionEffect = this.options.defaults.transitionEffect;
        $.fancybox.defaults.backFocus = this.options.defaults.backFocus;
    }
}