import "../global.js";
import Component from "./component";


export default class NavBar extends Component {
    
    get _defaultOptions() {
        return {
            offsetForFixed: 200
        }
    }

    constructor(options) {
        super(options);
        this.root = $('.nav-bar');
        this.scrollTop = null;        
        this.oldScrollTop = null;
        this.scrollTopDirection = null;
        this.init();
    }

    init() {
        super.initialize();
        NavBar.allowUpdate = true;
        this._updateNavBar();
        this._setSerachBox();
    }

    static allowUpdate;

    static enableUpdate(){
        NavBar.allowUpdate = true;
        //console.log('NavBar.allowUpdate = ', NavBar.allowUpdate);
    }

    static disableUpdate(){
        NavBar.allowUpdate = false;
        //console.log('NavBar.allowUpdate = ', NavBar.allowUpdate);
    }
    
            
    _bindEvents() {
        // событие скрол 
        NavBar._handleScrollThrottled = G.throttle(this._handleScroll.bind(this), 100);
        window.addEventListener('scroll', NavBar._handleScrollThrottled);

        // событие ресайз
        NavBar._handleWindowResizeThrottled = G.throttle(this._handleWindowResize.bind(this), 100);
        window.addEventListener('resize', NavBar._handleWindowResizeThrottled);

    }


    _setSerachBox() {
        $('.js-togle-search-box').on('click', function(e){
            $(this).parent().toggleClass('opened');
        });
    }
  

    _updateNavBar() {

        if(!NavBar.allowUpdate) return;
        
        this.oldScrollTop = this.scrollTop;
        this.scrollTop = G.getDocumentScrollTop();
        const isNavBarFixed = this.root.hasClass('fixed');

        if(this.oldScrollTop < this.scrollTop) {
            this.scrollTopDirection = "down";
        } else if( this.oldScrollTop > this.scrollTop ) {
            this.scrollTopDirection = "up";
        } else {
            this.scrollTopDirection = null;
        }

        // прилепиливаем шапку
        if ( this.scrollTop > this.options.offsetForFixed && !isNavBarFixed ) {
            this.root.addClass('fixed');
        }

        // отлепляем шапку
        if (this.scrollTop <= this.options.offsetForFixed && isNavBarFixed) {
            this.root.removeClass('fixed');
        }
        
        // крутим вниз
        if(this.scrollTopDirection === 'down') {
            this.root.removeClass('scroll-up');
            this.root.addClass('scroll-down');
        }
        // крутим вверх
        if(this.scrollTopDirection === 'up') {
            this.root.removeClass('scroll-down');
            this.root.addClass('scroll-up');
        }
        
    }

    _handleScroll() {
        this._updateNavBar();
    }

    _handleWindowResize() {
        this._updateNavBar();
    }
 

}