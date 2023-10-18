const viewsUpdate = (obj, num, actor, action, onAfterUpdate, oldNum, totalNumber, options) => {
    let el;
    let direction = 'right';
    if (oldNum === totalNumber -1 && num === 0) {
        direction = 'right';
    } else if (num < oldNum) {
        direction = 'left'
    } else if (num > oldNum) {
        direction = 'right'
    }
    const [ci, co, cr, cl, c0] = [
        options.classIn, 
        options.classOut, 
        options.classDirectionRight, 
        options.classDirectionLeft, 
        options.classInitial
    ]

    switch(action) {
        case 'on':
            el = actor.addEventListener('animationend', e => {
                e.target.classList.remove(cl, cr)
                onAfterUpdate.call(obj)
            }, {once: true, passive: false})
            actor.classList.remove(co, cl, cr, c0)
            actor.classList.add(ci, direction === 'left' ? cl : cr)
            break;
        case 'off':
            el = actor.addEventListener('animationend', e => {
                e.target.classList.remove(co, cl, cr)
            }, {once: true, passive: false})
            actor.classList.remove(ci, cl, cr, c0)
            actor.classList.add(co, direction === 'left' ? cl : cr)
            break;
    }
};



class yubooAnimator {
    static #defaults = {
        delay: 8000,
        auto: true,
        youTubePlayers: null,
        actorSelector: '.actor',
        pauseOnHover: true,
        updateFunc: viewsUpdate,
        classIn: 'in',
        classOut: 'out',
        classDirectionLeft: 'direction-left',
        classDirectionRight: 'direction-right',
        classInitial: 'initial'
    };
    static #defautsNoOverride = {};

    #stage = null;
    #timeouts = [];
    #paused = false;
    #animating = false;
    #interrupted = false;
    #oldActor = null;
    #currentActor = 0;
    #options = {};
    
    #actors() {
        return Array.from(this.#stage.querySelectorAll(this.#options.actorSelector))
    };
    #updateViews(num, action) {
        this.#options.updateFunc(this, num, this.#actors()[num], action, this.#onAfterUpdate, this.#oldActor, this.#actors().length, this.#options)
    };
    #onAfterUpdate() {
        this.#animating = false;
        if (!this.#paused && !this.#interrupted) {
            this.start()
        }
    };
    #queue() {
        if (!this.#paused && !this.#interrupted && !this.#animating) {
            this.#timeouts.push(setTimeout(this.next.bind(this), this.#options.delay))
        }
    };
    constructor(stage, options) {
        this.#stage = stage;
        this.#options = {
            ...yubooAnimator.#defaults,
            ...options,
            ...yubooAnimator.#defautsNoOverride
        };
        this.#stage.addEventListener('mouseleave', this.leave.bind(this))
        this.#stage.addEventListener('mouseenter', this.enter.bind(this))
        if (this.#options.auto) {
            this.start()
        }

    };
    enter() {
        if (this.#options.pauseOnHover) {
            this.pause()
        }
    };
    leave() {
        if (this.#options.pauseOnHover) {
            this.resume()
        }
    };
    showOptions() {
    };
    start() {
        this.#paused = false
        this.halt();
        if (this.#options.auto) {
            this.#queue()
        }

    };
    next() {
        this.go(this.#currentActor + 1)
        
    };
    prev() {
        this.go(this.#currentActor - 1)
    };
    go(n) {
        this.halt();
        this.#interrupted = false;
        if (this.#currentActor === n) {
            return;
        }
        this.#oldActor = this.#currentActor;
        this.#currentActor = (n + this.#actors().length) % this.#actors().length;
        this.#updateViews(this.#oldActor, 'off');
        this.#updateViews(this.#currentActor, 'on');
        

    };
    halt() {
        let to;
        while (undefined !== (to = this.#timeouts.shift())) {
            clearTimeout(to)
        }
    };
    pause() {
        this.#paused = true;
        this.halt()
    };
    resume() {
        if (!this.#interrupted) { 
            this.#paused = false
                this.start()
        }

    };
    interrupt() {
        this.#interrupted = true;
        this.halt();
    }

}


const createAnimator = (parent, options) => {
    if (typeof parent === 'string') {
        parent = document.querySelector(parent)
    }
    if (typeof parent === 'object' && parent instanceof HTMLElement) {
        return new yubooAnimator(parent, options) 
    }
    throw('First parameter must be a CSS selector string or an HTML Element')
}
export { createAnimator }
