import jQuery from "jquery";
import {merge} from "lodash";

//export default class Component extends Emitter {
export default class Component {
    
    constructor(...args) {
        //super();

        if (args.length === 2) {
            this.root = args[0];
            this.options = merge(this._defaultOptions, args[1]);
            
        } else if (args.length === 1) {
            if (Component.isjQuery(args[0])) {
                this.root = args[0];
            } else {
                this.options = merge(this._defaultOptions, args[0]);
            }
        }
    }

    static isjQuery(object) {
        return object instanceof jQuery;
    }

    initialize() {
        this._cacheNodes();
        this._bindEvents();
        this._ready();
    }

    _cacheNodes() {}

    _bindEvents() {}

    _ready() {}
}