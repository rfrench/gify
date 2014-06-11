# gify
JavaScript API for decoding/parsing information from animated GIFs using ArrayBuffers.

## Requirements
gify requires [jDataView](https://github.com/vjeux/jDataView) for reading binary files. Please pull the latest from their repository.

## API
* **isAnimated**(sourceArrayBuffer) (bool)
* **getInfo**(sourceArrayBuffer) (gifInfo)

## gifInfo Properties
* **valid** (bool) - Determines if the GIF is valid.
* **animated** (bool) - Determines if the GIF is animated.
* **height** (int) - Canvas height.
* **width** (int) - Canvas width.
* **frames** (int) - Total number of frames within the GIF.
* **frameDelays** (array) - An array of every frame delay.
* **isBrowserDuration** (bool) - If any of the delay times are lower than the [minimum value](http://nullsleep.tumblr.com/post/16524517190/animated-gif-minimum-frame-delay-browser-compatibility), this value will be set to true.
* **duration** (int) - Actual duration calculated from the delay time for each frame. If isBrowserDuration is false, you should use this value.
* **durationIE** (int) - Duration for Internet Explorer (16fps)
* **durationSafari** (int) - Duration for Safari (16fps)
* **durationFirefox** (int) - Duration for Firefox (50fps)
* **durationChrome** (int) - Duration for Chrome (50fps)
* **durationOpera** (int) - Duration for Opera (50fps)


### Example
``` js
//parse the GIF info
var gifInfo = gify.getInfo(sourceArrayBuffer);
```

## Resources
* [What's In A GIF - Bit by Byte](http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp) - Hands down the best write up on GIFs I've found.
* [GIF98](http://www.w3.org/Graphics/GIF/spec-gif89a.txt) - GIF98 RFC.
* [Animated GIF Frame Rate by Browser](http://nullsleep.tumblr.com/post/16524517190/animated-gif-minimum-frame-delay-browser-compatibility) - An awesome breakdown of how each browser renders animated GIFs. Thanks to Jeremiah Johnson for doing the hard work.
* [GIF Format](http://www.onicos.com/staff/iz/formats/gif.html) - GIF blocks.
* [Hexfiend](http://ridiculousfish.com/hexfiend/) - Awesome open source HEX editor (OSX)

## TODO
* Optimize this code.

## License
Licence: [Do What The Fuck You Want To Public License](http://sam.zoy.org/wtfpl/)