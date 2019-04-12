# Video-fit Polyfill

![npm](https://img.shields.io/npm/v/video-fit-polyfill.svg)

An object-fit polyfill for videos.

## Installation

```sh
npm install @firstandthird/video-fit-polyfill
```

## Usage

For magic:

1. Import it
2. Use **fit-video** as class in all the videos you want.
3. Magic

If you prefer to use your own selector, import the function and use it as it's shown below.

```js
videoFitPolyfill('.my-custom-selector')
```

If the browser supports object-fit it won't do anything.
