/*
 * gify v0.6
 * https://github.com/rfrench/gify
 *
 * Copyright 2013, Ryan French
 *
 * Licence: Do What The Fuck You Want To Public License
 * http://www.wtfpl.net/
 */

/*global console, jDataView, ArrayBuffer */

var gify = (function() { 'use strict';
  function getPaletteSize(palette) {
    return (3 * Math.pow(2, 1 + bitToInt(palette.slice(5, 8))));
  }
  function getDuration(duration) {
    return ((duration / 100) * 1000);
  }
  function bitToInt(bitArray) {
    return bitArray.reduce(function(s, n) { return s * 2 + n; }, 0);
  }
  function byteToBitArray(val) {
    var a = [];
    for (var i = 7; i >= 0; i--) {
      a.push(!!(val & (1 << i)));
    }
    return a;
  }
  function getSubBlockSize(view, pos) {
    var totalSize = 0;
    while (true) {
      var size = view.getUint8(pos + totalSize, true);
      if (size === 0) {
        totalSize++;
        break;
      }
      else {
        totalSize += size + 1;
      }
    }

    return totalSize;
  }
  function getInfo(sourceArrayBuffer, quickPass) {
    var pos = 0, size = 0, paletteSize = 0;
    var defaultDelay = getDuration(10);
    var info = {
      valid: false,
      height: 0,
      width: 0,
      animated: false,
      frames: 0,
      isBrowserDuration: false,
      frameDelays: [],
      duration: 0,
      durationIE: 0,
      durationSafari: 0,
      durationFirefox: 0,
      durationChrome: 0,
      durationOpera: 0
    };

    var view = new jDataView(sourceArrayBuffer);

    //needs to be at least 10 bytes long
    if(sourceArrayBuffer.byteLength < 10) { return info; }

    //GIF8
    if ((view.getUint16(0) != 0x4749) || (view.getUint16(2) != 0x4638)) {
      return info;
    }

    //get height/width
    info.height = view.getUint16(6, true);
    info.width = view.getUint16(8, true);

    //not that safe to assume, but good enough by this point
    info.valid = true;

    //parse global palette
    var globalPalette = byteToBitArray(view.getUint8(10, true));
    if (globalPalette[0]) {
      pos += getPaletteSize(globalPalette);
    }

    pos += 13;
    while (true) {
      try {
        var block = view.getUint8(pos, true);

        switch(block)
        {
          case 0x21: //EXTENSION BLOCK
            var type = view.getUint8(pos + 1, true);
            if (type === 0xF9) {
                var length = view.getUint8(pos + 2);
                if (length === 4) {
                  var delay = getDuration(view.getUint16(pos + 4, true));
                  
                  if (delay < 60 && !info.isBrowserDuration) {
                    info.isBrowserDuration = true;
                  }

                  //http://nullsleep.tumblr.com/post/16524517190/animated-gif-minimum-frame-delay-browser-compatibility
                  info.duration += delay;
                  info.durationIE += (delay < 60) ? defaultDelay : delay;
                  info.durationSafari += (delay < 60) ? defaultDelay : delay;
                  info.durationChrome += (delay < 20) ? defaultDelay : delay;
                  info.durationFirefox += (delay < 20) ? defaultDelay : delay;
                  info.durationOpera += (delay < 20) ? defaultDelay : delay;

                  //push frame delay
                  info.frameDelays.push(delay);

                  //increment frame count
                  info.frames++;
                  if (info.frames > 1 && !info.animated) {
                    info.animated = true;
                    
                    //quickly bail if the gif has more than one frame
                    if (quickPass) {
                      return info;
                    }
                  }
                  pos += 8;
                }
                else {
                  pos++;
                }
            }
            else { // AEB, CEB, PTEB, ETC
              pos += 2;
              pos += getSubBlockSize(view, pos);
            }
            break;
          case 0x2C: //IMAGE BLOCK
            var localPalette = byteToBitArray(view.getUint8(pos + 9, true));
            if (localPalette[0]) {
              //local palette?
              pos += getPaletteSize(localPalette);
            }
            pos += 11;
            pos += getSubBlockSize(view, pos);
            break;
          case 0x3B: //TRAILER BLOCK (THE END)
            return info;
          default: //UNKNOWN BLOCK (bad)
            pos++;
            break;
        }
      }
      catch(e) {
        info.valid = false;
        return info;
      }
      
      //this shouldn't happen, but if the trailer block is missing, we should bail at EOF
      if ((pos) >= sourceArrayBuffer.byteLength) { return info; }
    }

    return info;
  }
  return {
    isAnimated: function(sourceArrayBuffer) {
      var info = getInfo(sourceArrayBuffer, true);
      return info.animated;
    },
    getInfo: function(sourceArrayBuffer) {
      return getInfo(sourceArrayBuffer, false);
    }
  };
})();