import test from 'tape-rollup';
import { find } from 'domassist';
import objectFitPolyfill from '../index';

const init = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  container.innerHTML = `
    <video id="test" class="fit-video" muted="" autoplay="" playsinline="" aria-hidden="true" data-src="https://media.sgff.io/sgff_r1eHetbDYb/2018-11-12/1542049464199/hero-video.mp4 video/mp4">
      <source src="https://media.sgff.io/sgff_r1eHetbDYb/2018-11-12/1542049464199/hero-video.mp4" type="video/mp4">
    </video>

    <video class="fit-video" muted="" autoplay="" playsinline="" aria-hidden="true" data-src="https://media.sgff.io/sgff_r1eHetbDYb/2018-11-12/1542049464199/hero-video.mp4 video/mp4">
      <source src="https://media.sgff.io/sgff_r1eHetbDYb/2018-11-12/1542049464199/hero-video.mp4" type="video/mp4">
    </video>`;
};

init();
function polyfill() {
  const videos = find('.fit-video');
  const isEdge = (window.navigator.userAgent.indexOf('Edge/') !== -1);
  const img = new Image();
  const supportsObjectFit = 'object-fit' in img.style;
  if ((supportsObjectFit && !isEdge) || !videos.length) {
    return;
  }

  objectFitPolyfill(videos);
}

test('Change attributes if polyfill', assert => {
  polyfill();
  const videos = find('.fit-video');
  videos.forEach(element => {
    assert.equal(element.style.display, 'block');
    assert.equal(element.style.padding, '0px');
    assert.equal(element.style.opacity, '1');
  });

  assert.end();
});
