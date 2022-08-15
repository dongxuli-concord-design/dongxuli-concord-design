# Introduction

Geometric modeling library

# XcGmAssert

`function XcGmAssert({assertion, message = 'Unknown'})`

# XcGm2dPosition

`class XcGm2dPosition`

Represents a 2D position.

## constructor

`constructor({x = 0.0, y = 0.0} = {})`

* **x** A floating number representing X coordinate.
* **y** A floating number representing Y coordinate.

## fromArray

`static fromArray({array})`

* **array** Array in the `[x, y]` form.
* **return** `XcGm2dPosition` object

Constructs a XcGm2dPosition object from an array.
