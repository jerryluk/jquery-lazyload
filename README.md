# jQuery LazyLoad

This is a jQuery plugin for lazy loading images. Images outside of viewport won't be loaded before user scrolls to them. This plugin works with Google Chrome, Safari 5, Firefox 4, IE7, IE8, and IE9

This plugin is modified after Mika Tuupola's lazyload which does not work in some latest browsers.

##How to use?

For your HTML markup, please use data-src attribute instead of src:

    <img src="/path_to_place_holder" data-src="/path_to_your_real_image" />

In your Javascipt:

    $("img").lazyload();

##Options

threshold: how close to the edge image shoudl come before it is loaded. Default is 0

placeholder: placeholder image, but I recommended you use put the placeholder in the markup

container: jQuery object of the container, default is $(window)

delay: This will load the images with a small delay, such that when user scrolls down to bottom, it will skip loading some images that are not going to be seen. Default is 100

Example

    $("div.container img").lazyload({
      threshold: 200,
      container: $("div.container"),
      placeholder: "/gray.png",
      delay: 50
    });


##Misc

You can trigger the detection by triggering a "lazyload" event on the container, e.g.

    $("div.container").trigger("lazyload");
    
##License

This plugin is licensed under the MIT license.

Please feel free to let me know if you have any questions!
  