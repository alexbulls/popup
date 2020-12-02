
class Popup {
    constructor(args) {
        this.init(args);
    }

    init(args = {}) {
        this._createOptions(args);
        this._createAttr();
        this._switchEventListeners(true);
    }

    show() {
        const { options, attr } = this;
        const modal = document.getElementById(options.id);

        if (!modal) {
            return;
        }

        if (modal.classList.contains(attr.active)) {
            return;
        }

        options.before({ modal });
        modal.classList.add(this.attr.active);
    }

    hide() {
        const { options, attr } = this;
        const modal = document.getElementById(options.id);

        if (!modal) {
            return;
        }

        if (!modal.classList.contains(attr.active)) {
            return;
        }

        options.after({ modal });
        modal.classList.remove(this.attr.active);
    }

    switch() {
        const { options, attr } = this;
        const modal = document.getElementById(options.id);

        if (!modal) {
            return;
        }

        modal.classList.contains(attr.active) ? this.hide() : this.show();
    }

    _createOptions(options) {
        this.options = {
            id: null,
            after: () => {},
            before: () => {},
            animation: 'scale-in',
            hideKeyEsc: true,
            switchScroll: true,
            modifier: 'b-modal',
            hideClickOutContainer: true,
            catchEventShow: [],
            catchEventHide: [],
            ...options,
        };
    }

    _createAttr() {
        const { options } = this;
        const { modifier, animation } = options;

        this.attr = {
            cover: `${modifier}-switch-box--cover`,
            style: `${modifier}-switch-box--style`,
            active: `${modifier}-switch-box--active`,
            container: `${modifier}-switch-box--container`,
            animation: `${modifier}-switch-box--${animation}`,
        };
    }

    _switchEventListeners(add) {
        const method = add ? 'addEventListener' : 'removeEventListener';

        document[method]('click', this._eventClick);
        document[method]('keyup', this._eventKeyup);
    }

    // event listeners

    _eventClick = event => {
        const { target } = event;
        const { catchEventShow, catchEventHide } = this.options;

        for (const selectorName of catchEventShow) {
            const button = target.closest(selectorName);

            if (button) {
                event.preventDefault();
                this.show();

                return;
            }
        }

        for (const selectorName of catchEventHide) { // и правильно ловить
            const button = target.closest(selectorName);

            if (button) {
                event.preventDefault();
                this.hide();

                return;
            }
        }

        // еще добавить клик в пустое пространство
    };

    _eventKeyup = event => {
        const { options } = this;

        if (event.keyCode === 27 && options.hideKeyEsc) {
            this.hide();
        }
    };
}
