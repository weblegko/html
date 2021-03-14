// кнопка наверх
import Component from "./component";

export default class ScrollToTopBtn extends Component {
    
    constructor(root, options) {
        super(root, options);
        this.initialize();
    }

    initialize() {
        super.initialize();
        this.setToTopButton();
    }

    setToTopButton() {

        var $scrollTopBtn = $('<a rel="nofollow" href="#" id="scroll-top" class="scrolltotop-btn"><i></i></a>').appendTo('body');

        $scrollTopBtn.on('click', function() {
            $('html:not(:animated),body:not(:animated)').animate({ scrollTop: 0}, 300);
            return false;
        });

        $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            $scrollTopBtn.addClass('top-btn-show');
        } else {
            $scrollTopBtn.removeClass('top-btn-show');
        }
        });

        if ($scrollTopBtn.hasClass('top-btn-show')) {
        $scrollTopBtn.removeClass('top-btn-show');
        }
    }
}