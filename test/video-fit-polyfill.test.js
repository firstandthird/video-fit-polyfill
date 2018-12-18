import test from 'tape-rollup';
import { ready, find } from 'domassist';
import videoFitPolyfill from '../index';

const init = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  container.innerHTML = `
    <video id="test" class="fit-video" muted="" autoplay="" playsinline="" aria-hidden="true" data-src="https://media.sgff.io/sgff_r1eHetbDYb/2018-11-12/1542049464199/hero-video.mp4 video/mp4">
      <source src="https://app.coverr.co/s3/mp4/Shiny-Blurry-Tree.mp4" type="video/mp4">
    </video>

    <video class="fit-video" muted="" autoplay="" playsinline="" aria-hidden="true" data-src="https://media.sgff.io/sgff_r1eHetbDYb/2018-11-12/1542049464199/hero-video.mp4 video/mp4">
      <source src="https://app.coverr.co/s3/mp4/Shiny-Blurry-Tree.mp4" type="video/mp4">
    </video>`;
};

init();

ready(() => videoFitPolyfill('.fit-video'));

test('Object-fit is create', assert => {
  const objectFit = find('object-fit');
  objectFit.forEach(element => {
    assert.ok(element.nodeName.toLocaleLowerCase() === 'object-fit');
  });
  assert.end();
});

test('Object-fit has style', assert => {
  const objectFit = find('object-fit');
  objectFit.forEach(element => {
    assert.equal(element.style.display, 'inline-block');
    assert.equal(element.style.backgroundColor, 'rgba(0, 0, 0, 0)');
    assert.equal(element.style.position, 'static');
  });
  assert.end();
});

test('Change fit-videos attributes if polyfill', assert => {
  const videos = find('.fit-video');
  videos.forEach(element => {
    assert.equal(element.style.display, 'block');
    assert.equal(element.style.padding, '0px');
    assert.equal(element.style.opacity, '1');
    assert.equal(element.style.marginTop, '0px');
    assert.equal(element.style.marginLeft, '0px');
  });

  assert.end();
});
