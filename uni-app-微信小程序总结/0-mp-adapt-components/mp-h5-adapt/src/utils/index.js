/**
 * 动态加载js
 * @param url 加载的url地址
 */

export const loadScript = (url = '') => {
  if (/^\/\//.test(url)) {
    url = (location.protocol === 'http:' ? 'http:' : 'https:') + url;
  }

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (
            script.readyState === 'loaded' ||
            script.readyState === 'complete'
          ) {
            script.onreadystatechange = null;
            resolve();
          }
        };
      } else {
        script.onload = () => {
          resolve();
        };
      }
      script.src = url;

      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};
