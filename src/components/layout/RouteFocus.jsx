import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteFocus() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus();
    });
  }, [pathname]);

  return null;
}
