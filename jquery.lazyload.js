/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2011 Jerry Luk
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified after Mika Tuupola's lazyload:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.0.0
 *
 */
 (function($) {

    $.fn.lazyload = function(options) {
        var settings = {
            threshold: 0,
            failurelimit: 0,
            delay: 100,
            container: window
        };

        if (options) {
            $.extend(settings, options);
        }
        
        function checkElements(event) {
            var counter = 0;
            elements.each(function() {
                if ($(this).data("src") && $(this).is(":visible")){
                  if ($.abovethetop(this, settings) ||
                  $.leftofbegin(this, settings)) {
                      /* Nothing. */
                  } else if (!$.belowthefold(this, settings) &&
                  !$.rightoffold(this, settings)) {
                      $(this).trigger("appear");
                  } else {
                      if (counter++ > settings.failurelimit) {
                          return false;
                      }
                  }
                }
            });
        }

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        var elements = this,
          timeout = null;
        $(settings.container).bind("scroll lazyload",
          function(e) {
            if (timeout) {
              clearTimeout(timeout);
            }
            timeout = setTimeout(function() {
              checkElements(e);
            }, options.delay);
          }
        );

        this.each(function() {
            var $this = $(this);
            if (settings.placeholder) {
                $this.attr("src", settings.placeholder);  
            }
            $this.one("appear",
              function(e) {
                  $this.attr("src", $this.data("src"));
                  $(this).data("src", null);
              });
        });

        /* Force initial check if images should appear. */
        $(settings.container).trigger("lazyload");

        return this;

    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).height() + $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).width() + $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left;
        }
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold": "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold": "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold": "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold": "!$.rightoffold(a, {threshold : 0, container: window})"
    });

})(jQuery);
