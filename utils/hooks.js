import { useState, useEffect } from 'react';

function getWindowDimensions() {
  return {
    width: typeof window !== undefined ? window.innerWidth : 0,
    height: typeof window !== undefined ? window.innerHeight : 0
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export { useWindowDimensions } 