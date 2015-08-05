/**
 * Animate Riot v2 Components
 * @author Sartaj
 * @contributor Nate Chapman
 * @license MIT 2015
 */


/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = (function() {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

                window.setTimeout(callback, 1000 / 60);

            };

    })();

}

/**
 * Cross browser animation checks
 */
var pfx = ["webkit", "moz", "MS", "o", ""];

function on(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) type = type.toLowerCase();
        element.addEventListener(pfx[p] + type, callback, false);
    }
}

/**
 * The Animate Mixin
 */
var OptsAnimateMixin = {
    init: function() {

        this.on('mount', function() {

            createAnimation.call(this, 'enter');

            var animationEnded = function(e) {

                var item = e.target;

                if (this.enterClasses) {
                    this.enterClasses.forEach(function(classToAnimate) {
                        item.classList.remove(classToAnimate);
                    });
                }

                if (this.leaveClasses) {
                    this.leaveClasses.forEach(function(classToAnimate) {
                        item.classList.remove(classToAnimate);
                    });
                }

                // remove animate.css class
                item.classList.remove('animated');

                // Remove all other classes
                item.classList.remove('riot-enter-active');
                item.classList.remove('riot-enter');
                item.classList.remove('riot-animate');

                // Remove all other classes
                item.classList.remove('riot-leave-active');
                item.classList.remove('riot-leave');
                item.classList.remove('riot-animate');

                var delay = item.getAttribute('animate-delay');
                if (delay) {
                    item.style.animationDelay = '';
                    item.style.transitionDelay = '';
                }

                var duration = item.getAttribute('animate-duration');
                if (duration) {
                    item.style.animationDuration = '';
                    item.style.transitionDuration = '';
                }

            }.bind(this)

            // After animation has ended
            this.root.addEventListener("transitionend", animationEnded, false);
            this.root.addEventListener("animationend", animationEnded, false);

        });


    },
    animatedUnmount: function() {

        createAnimation.call(this, 'leave');

        var waitFor = 1;

        var unmount = function(e) {
            e.target.style.visibility = 'hidden';
            if (waitFor === this.animatedDomElements.length) {
                this.unmount();
            } else {
                waitFor++;
            }
        }.bind(this)

        // After animation has ended
        this.root.addEventListener("transitionend", unmount, false);
        this.root.addEventListener("animationend", unmount, false)

    }
};

function createAnimation(ANIMATION_NAME) {

    // Get attributes you want to animate
    this.animatedDomElements = this.root.querySelectorAll('[animate]');

    for (var x = 0; x < this.animatedDomElements.length; x++) {

        // Item to add animations to
        var item = this.animatedDomElements[x];

        // Get attribute string
        var attributeToAnimate = item.getAttribute('animate-' + ANIMATION_NAME);

        if (!attributeToAnimate) {
            var attributeToAnimate = item.getAttribute('animate');
        }

        // Get all space separated classes
        this.enterClasses = attributeToAnimate.split(' ');

        // Add those classes to this item
        this.enterClasses.forEach(function(classToAnimate) {
            item.classList.add(classToAnimate);
        });

        var delay = item.getAttribute('animate-delay');
        if (delay) {
            item.style.animationDelay = delay;
            item.style.transitionDelay = delay;
        }

        var duration = item.getAttribute('animate-duration');
        if (duration) {
            item.style.animationDuration = duration;
            item.style.transitionDuration = duration;
        }

        // Add initial enter animation class
        item.classList.add('riot-' + ANIMATION_NAME);
    }

    // Add animation for enter after 1 frame
    window.requestAnimationFrame(function() {
        for (var x = 0; x < this.animatedDomElements.length; x++) {
            var item = this.animatedDomElements[x];
            // animate.css support
            item.classList.add('animated');
            item.classList.add('riot-animate');
            item.classList.add('riot-' + ANIMATION_NAME + '-active');
        }
    }.bind(this));
}

module.exports = OptsAnimateMixin;
