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
 * Version:  1.0.1
 *
 */
 (function($) {

    $.fn.lazyload = function(options) {
        var settings = {
            threshold: 0,
            failurelimit: 0,
            delay: 0,
            container: window
        },
        elements = this,
        timeout = null,
        $lastElement;

        if (options) {
            $.extend(settings, options);
        }

        function checkElements(event) {
            var counter = 0;
            var containerOffsets = getOffsets(settings.container);
            elements.each(function() {
                if ($(this).data("src") && $(this).is(":visible")) {
                    var elementOffsets = getOffsets($(this));
                    if (aboveTheTop(containerOffsets, elementOffsets, settings) ||
                    leftOfBegin(containerOffsets, elementOffsets, settings)) {
                        /* Nothing. */
                    } else if (!belowTheFold(containerOffsets, elementOffsets, settings) &&
                    !rightOfFold(containerOffsets, elementOffsets, settings)) {
                        $(this).trigger("appear");
                    } else {
                        if (counter++>settings.failurelimit) {
                            return false;
                        }
                    }
                }
            });
        }

        function getOffsets(element) {
            var elementTop,
            elementLeft,
            elementWidth,
            elementHeight;
            if (element == undefined || element == window) {
                elementTop = $(window).scrollTop();
                elementHeight = $(window).height();
                elementLeft = $(window).scrollLeft();
                elementWidth = $(window).width();
            } else {
                elementTop = $(element).offset().top;
                elementHeight = $(element).height()
                elementLeft = $(element).offset().left;
                elementWidth = $(element).width();
            }
            return {
                top: elementTop,
                height: elementHeight,
                left: elementLeft,
                width: elementWidth
            }
        }

        function belowTheFold(containerOffsets, elementOffsets, settings) {
            var fold = containerOffsets.top + containerOffsets.height;
            return fold <= elementOffsets.top - settings.threshold;
        }

        function rightOfFold(containerOffsets, elementOffsets, settings) {
            var fold = containerOffsets.left + containerOffsets.width;
            return fold <= elementOffsets.left - settings.threshold;
        }

        function aboveTheTop(containerOffsets, elementOffsets, settings) {
            var fold = containerOffsets.top;
            return fold >= elementOffsets.top + settings.threshold + elementOffsets.height;
        }

        function leftOfBegin(containerOffsets, elementOffsets, settings) {
            var fold = containerOffsets.left;
            return fold >= elementOffsets.left + settings.threshold + elementOffsets.width;
        }

        this.each(function() {
            var $this = $(this);
            $lastElement = $this;
            if (settings.placeholder) {
                $this.attr("src", settings.placeholder);
            }
            $this.one("appear",
            function(e) {
                $this.attr("src", $this.data("src"));
                $(this).data("src", null);
            });
        });

        /* Put a load handler on the last element because when the load event is fired, the image is rendered in
           the DOM. Without it, it will cause the browser to run really slow for computing the offset */
        $lastElement.one("load",
        function() {
            /* Fire one scroll event per scroll. Not one scroll event per image. */
            $(settings.container).bind("scroll lazyload",
              function(e) {
                  if (timeout) {
                      clearTimeout(timeout);
                  }
                  timeout = setTimeout(function() {
                      checkElements();
                  },
                  options.delay);
              }
            );
            /* Force initial check if images should appear. */
            checkElements();
        });
        
        return this;
    };

})(jQuery);
