# riot-animate - Animate Riot 2
This riot mixin is inspired by `ngAnimate`, and provides an animation system for mounts and unmounts.

You can have an animation CSS class and use an ngAnimate style system, linking animations to `riot-enter`, `riot-enter-active`, `riot-leave`, and `riot-leave-active`.

To have animations on unmount, you must `this.animateUnmount()`. This allows for a 'leave' animation to occur before unmounting, i.e. removing DOM elements from the file.

In addition, you can easily use animate.css and use the attributes `animate`, `animate-enter`, and `animate-leave`, along with adding `animate-delay` and `animate-duration`.

For examples, see `sartaj.github.io/riot-animate` and view the source of the riot tag.

