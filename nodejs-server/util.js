"use strict";

var IpSubnetCalculator = {
  calculate: function (ipStart, ipEnd) {
    var ipStartNum, ipEndNum, ipCurNum;
    var rangeCollection = [];
    try {
      ipStartNum = this.toDecimal(ipStart);
      ipEndNum = this.toDecimal(ipEnd);
    } catch (err) {
      return null;
    }

    if (ipEndNum < ipStartNum) {
      return null;
    }

    ipCurNum = ipStartNum;

    while (ipCurNum <= ipEndNum) {
      var optimalRange = this.getOptimalRange(ipCurNum, ipEndNum);

      if (optimalRange === null) {
        return null;
      }

      rangeCollection.push(optimalRange);

      ipCurNum = optimalRange.ipHigh + 1;
    }

    return rangeCollection;
  },

  calculateSubnetMask: function (ip, prefixSize) {
    var ipNum;

    try {
      ipNum = this.toDecimal(ip);
    } catch (err) {
      return null;
    }

    return this.getMaskRange(ipNum, prefixSize);
  },

  calculateCIDRPrefix: function (ip, subnetMask) {
    var ipNum,
      subnetMaskNum,
      prefix = 0,
      newPrefix = 0,
      prefixSize;

    try {
      ipNum = this.toDecimal(ip);
      subnetMaskNum = this.toDecimal(subnetMask);
    } catch (err) {
      return null;
    }

    for (prefixSize = 0; prefixSize < 32; prefixSize++) {
      newPrefix = (prefix + (1 << (32 - (prefixSize + 1)))) >>> 0;

      if ((subnetMaskNum & newPrefix) >>> 0 !== newPrefix) {
        break;
      }

      prefix = newPrefix;
    }

    return this.getMaskRange(ipNum, prefixSize);
  },

  getOptimalRange: function (ipNum, ipEndNum) {
    var prefixSize,
      optimalRange = null;

    for (prefixSize = 32; prefixSize >= 0; prefixSize--) {
      var maskRange = this.getMaskRange(ipNum, prefixSize);

      if (maskRange.ipLow === ipNum && maskRange.ipHigh <= ipEndNum) {
        optimalRange = maskRange;
      } else {
        break;
      }
    }

    return optimalRange;
  },

  getMaskRange: function (ipNum, prefixSize) {
    var prefixMask = this.getPrefixMask(prefixSize),
      lowMask = this.getMask(32 - prefixSize),
      ipLow = (ipNum & prefixMask) >>> 0,
      ipHigh = (((ipNum & prefixMask) >>> 0) + lowMask) >>> 0;

    return {
      ipLow: ipLow,
      ipLowStr: this.toString(ipLow),

      ipHigh: ipHigh,
      ipHighStr: this.toString(ipHigh),

      prefixMask: prefixMask,
      prefixMaskStr: this.toString(prefixMask),
      prefixSize: prefixSize,

      invertedMask: lowMask,
      invertedMaskStr: this.toString(lowMask),
      invertedSize: 32 - prefixSize,
    };
  },

  getPrefixMask: function (prefixSize) {
    var mask = 0,
      i;

    for (i = 0; i < prefixSize; i++) {
      mask += (1 << (32 - (i + 1))) >>> 0;
    }

    return mask;
  },

  getMask: function (maskSize) {
    var mask = 0,
      i;

    for (i = 0; i < maskSize; i++) {
      mask += (1 << i) >>> 0;
    }

    return mask;
  },

  isIp: function (ip) {
    if (typeof ip !== "string") {
      return false;
    }

    var parts = ip.match(
      /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/
    );

    if (parts === null) {
      return false;
    }

    for (var i = 1; i <= 4; i++) {
      var n = parseInt(parts[i], 10);

      if (n > 255 || n < 0) {
        return false;
      }
    }

    return true;
  },

  isDecimalIp: function (ipNum) {
    return (
      typeof ipNum === "number" && // is this a number?
      ipNum % 1 === 0 && // does the number have a decimal place?
      ipNum >= 0 &&
      ipNum <= 4294967295
    );
  },

  toDecimal: function (ipString) {
    if (typeof ipString === "number" && this.isDecimalIp(ipString) === true) {
      return ipString;
    }

    if (this.isIp(ipString) === false) {
      throw new Error("Not an IP address: " + ipString);
    }

    var d = ipString.split(".");

    return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
  },
  toString: function (ipNum) {
    if (typeof ipNum === "string" && this.isIp(ipNum) === true) {
      return ipNum;
    }

    if (this.isDecimalIp(ipNum) === false) {
      throw new Error("Not a numeric IP address: " + ipNum);
    }

    var d = ipNum % 256;

    for (var i = 3; i > 0; i--) {
      ipNum = Math.floor(ipNum / 256);
      d = (ipNum % 256) + "." + d;
    }

    return d;
  },
};

if (typeof define === "function" && define.amd) {
  define([], function () {
    return IpSubnetCalculator;
  });
} else if (typeof exports === "object") {
  module.exports = IpSubnetCalculator;
}
