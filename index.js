/* eslint-disable no-console */
import { styles } from 'domassist';

export default function objectFitlPolyfill(videos) {
  const v = [];
  const wrapper = document.createElement('object-fit');

  videos.forEach(video => {
    const vi = video;
    vi.getCss = window.getComputedStyle(video);
    vi.setCss = video.style;
    v.push(vi);
    // create and insert a wrapper element
    wrapper.appendChild(video.parentNode.replaceChild(wrapper, video));
  });

  // style the wrapper element to mostly match the source element
  const wrapCss = {
    height: '100%',
    width: '100%',
    boxSizing: 'content-box',
    display: 'inline-block',
    overflow: 'hidden'
  };

  function doWork(video) {
    // the actual size and ratio of the video
    // we do this here, even though it doesn't change, because
    // at this point we can be sure the metadata has loaded
    const videoWidth = video.target.videoWidth;
    const videoHeight = video.target.videoHeight;
    const videoRatio = videoWidth / videoHeight;

    const wrapWidth = wrapper.clientWidth;
    const wrapHeight = wrapper.clientHeight;
    const wrapRatio = wrapWidth / wrapHeight;

    let newHeight = 0;
    let newWidth = 0;
    video.target.setCss.marginLeft = video.target.setCss.marginTop = 0;

    if (videoRatio > wrapRatio) {
      newHeight = wrapHeight * videoRatio;

      video.target.setCss.width = `${Math.round(newHeight)}px`;
      video.target.setCss.height = `${wrapHeight}px`;
      video.target.setCss.marginLeft = `${Math.round((wrapWidth - newHeight) / 2)}px`;
    } else {
      newWidth = wrapWidth / videoRatio;

      video.target.setCss.width = `${wrapWidth}px`;
      video.target.setCss.height = `${Math.round(newWidth)}px`;
      video.target.setCss.marginTop = `${Math.round((wrapHeight - newWidth) / 2)}px`;
    }
  }

  v.forEach(video => {
    video.setCss.border = video.setCss.margin = video.setCss.padding = 0;
    video.setCss.display = 'block';
    video.setCss.opacity = 1;

    'backgroundColor backgroundImage borderColor borderStyle borderWidth bottom fontSize lineHeight left opacity margin position right top visibility'.replace(/\w+/g, key => {
      wrapCss[key] = video.getCss[key];
    });

    styles(wrapper, wrapCss);

    video.addEventListener('loadedmetadata', doWork);
    window.addEventListener('optimizedResize', doWork);
    // we may have missed the loadedmetadata event, so if the video has loaded
    // enough data, just drop the event listener and execute
    if (video.readyState >= 1) {
      video.video.removeEventListener('loadedmetadata', doWork);
      doWork(video);
    }
  });
}
