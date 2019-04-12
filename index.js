import { ready, find, styles } from 'domassist';

export default function videoFitPolyfill(selector) {
  const isEdge = (window.navigator.userAgent.indexOf('Edge/') !== -1);
  const img = new Image();
  const supportsObjectFit = 'object-fit' in img.style;
  if ((supportsObjectFit && !isEdge)) {
    return;
  }

  const videos = find(selector);
  const videoArray = [];
  const wrappers = [];

  videos.forEach(video => {
    const wrapper = document.createElement('object-fit');
    wrappers.push(wrapper);
    video.getCss = window.getComputedStyle(video);
    video.setCss = video.style;
    videoArray.push(video);
    wrapper.appendChild(video.parentNode.replaceChild(wrapper, video));
  });

  const wrapCss = {
    height: '100%',
    width: '100%',
    boxSizing: 'content-box',
    display: 'inline-block',
    overflow: 'hidden'
  };

  function doWork(event) {
    const video = event.currentTarget;
    const wrapper = video.parentElement;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoRatio = videoWidth / videoHeight;

    const wrapWidth = wrapper.clientWidth;
    const wrapHeight = wrapper.clientHeight;
    const wrapRatio = wrapWidth / wrapHeight;

    let newHeight = 0;
    let newWidth = 0;

    video.setCss.marginLeft = video.setCss.marginTop = 0;

    if (videoRatio > wrapRatio) {
      newHeight = wrapHeight * videoRatio;

      video.setCss.width = `${Math.round(newHeight)}px`;
      video.setCss.height = `${wrapHeight}px`;
      video.setCss.marginLeft = `${Math.round((wrapWidth - newHeight) / 2)}px`;
    } else {
      newWidth = wrapWidth / videoRatio;

      video.setCss.width = `${wrapWidth}px`;
      video.setCss.height = `${Math.round(newWidth)}px`;
      video.setCss.marginTop = `${Math.round((wrapHeight - newWidth) / 2)}px`;
    }
  }

  videoArray.forEach((video, index) => {
    video.setCss.border = video.setCss.margin = video.setCss.padding = 0;
    video.setCss.display = 'block';
    video.setCss.opacity = 1;

    'backgroundColor backgroundImage borderColor borderStyle borderWidth bottom fontSize lineHeight left opacity margin position right top visibility'.replace(/\w+/g, key => { wrapCss[key] = video.getCss[key]; });

    styles(wrappers[index], wrapCss);

    video.addEventListener('loadedmetadata', doWork);

    if (video.readyState >= 1) {
      video.video.removeEventListener('loadedmetadata', doWork);
      doWork({
        currentTarget: video
      });
    }
  });
}

ready(() => videoFitPolyfill('.fit-video'));
