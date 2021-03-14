import "slick-carousel";
import Component from "./component";

export default class Slider extends Component {
    get _defaultOptions() {
        return {
            rows: 0,
            counter: false,
            prevArrow: '<button class="slider-prev"><span class="icon-left"></span></button>',
            nextArrow: '<button class="slider-next"><span class="icon-right"></span></button>'
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
        this.nodes = {};
    }

    _bindEvents() {
        this.root.on('init', this.addCounter);
        this.root.on('beforeChange', this.changeCounter);
        this.root.on('breakpoint', this.addCounter);
    }

    _ready() {
        this.root.slick(this.options);
    }

    addCounter(event, slick) {
        if (slick.options.counter === true && slick.slideCount > slick.options.slidesToShow) {
            let $counter = $('<div class="slick-counter slick-cloned"><div class="slick-counter__inner">' +
                '<span class="slick-counter__current">' + (slick.currentSlide + 1) + '</span>' +
                '<span role="separator" class="slick-counter__divider"></span>' +
                '<span class="slick-counter__count">' + (slick.getDotCount() + 1) + '</span></div></div>');

            $counter.appendTo(slick.$slider);
        }
    }

    changeCounter(event, slick, currentSlide, nextSlide) {
        slick.$slider.find('.slick-counter__current').html(Math.floor(nextSlide / slick.options.slidesToScroll) + 1);
    }
}