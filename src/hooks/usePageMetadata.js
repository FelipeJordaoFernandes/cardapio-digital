import { useEffect } from 'react';
import { storeConfig } from '../config/store';

const defaultTitle = `${storeConfig.name} | Cardápio digital`;

function getOrCreateMeta(attribute, value) {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  return element;
}

function updateMeta(attribute, value, content) {
  getOrCreateMeta(attribute, value).setAttribute('content', content);
}

export function usePageMetadata({ title, description, path = '/', index = true }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${storeConfig.name}` : defaultTitle;
    const canonicalUrl = new URL(path, storeConfig.siteUrl).toString();

    document.title = pageTitle;
    updateMeta('name', 'description', description);
    updateMeta('name', 'robots', index ? 'index, follow' : 'noindex, nofollow');
    updateMeta('property', 'og:title', pageTitle);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('name', 'twitter:title', pageTitle);
    updateMeta('name', 'twitter:description', description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [description, index, path, title]);
}
