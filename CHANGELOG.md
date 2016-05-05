* **May 5 2016**
  * Bug fix for parsing loop count (issue #3). Thank you [tutunci](https://github.com/tutunci)

* **April 12 2016**
  * Bug fix for height / width being switched on the "info" object (issue #2). Thank you [Prinzhorn](https://github.com/Prinzhorn)
  * Added global palette R,G,B color parsing. Thank you [Beppe](https://github.com/Beppe)

* **June 20 2014**
  * Added Image comments, text, and image identifier to the image object.
  * Updated Safari duration to reflect the updated frames per second. (50fps)
  
* **June 13 2014**
  * 1.0 released! Unfortunately, that comes with the cost of having to break the existing API.
  * Removed frames and frameDelays from info object and replaced with images array. Use info.images.length now to get the count.
  * Fixed a bug with image counting when the Graphics Control Extension (21F9) block isn't present, since it's optional. This should of only occurred with single frame GIFs.
  * Updated example.html to display the duration and JSON rather than writing to the console.
  * defaultDelay is now a constant. I can't even come up with a reason why it wasn't before.

* **June 11 2014**
  * Added (bool) isAnimated method. This method provides a faster way of determining if a GIF contains more than one image.