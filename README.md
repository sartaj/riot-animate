# riot-animate - Animate Riot 2
This riot mixin is inspired by `ngAnimate`, and provides an animation system for mounts and unmounts.

You can have an animation CSS class and use an ngAnimate style system, linking animations to `riot-enter`, `riot-enter-active`, `riot-leave`, and `riot-leave-active`.

To have animations on unmount, you must `this.animateUnmount()`. This allows for a 'leave' animation to occur before unmounting, i.e. removing DOM elements from the file.

In addition, you can easily use animate.css and use the attributes `animate`, `animate-enter`, and `animate-leave`, along with adding `animate-delay` and `animate-duration`.

## Example

```css

      .fade.riot-animate {
        transition:0.5s linear all;
      }

      .fade.riot-enter,
      .fade.riot-leave.riot-leave-active  {
        opacity:0;
      }

      .fade.riot-enter.riot-enter-active ,
      .fade.riot-leave {
        opacity:1;
      }

```

```javascript

        <timer>
          // This is using a ngAnimate style 'enter' 'leave' css class
          <div class="card card-fade" animate="fade" animate-duration="300ms" animate-delay="1000ms">
            <p class="">Using ngAnimate style classes</p>
          </div>

          // This is using an animate.css 
          <div class="card" each="{item, i in items}" animate="zoomIn" animate-leave="zoomOut" animate-duration="300ms" animate-delay="{i*20}ms">
            <p class="">Using animate.css</p>
          </div>

          this.items = opts.items;

          setTimeout(function(){
	          // Special unmount function
            this.animatedUnmount();
          }.bind(this),3000);

          this.mixin(riotAnimate);

```
