import React, { useState } from 'react';
import './App.css';
import useKeyboardNavigation from './hooks/useKeyboardNavigation';
import Controls from './components/Controls';
import DragArea from './components/DragArea';

export default function App() {
  const [opacity, setOpacity] = useState(100);
  const [zoom, setZoom] = useState(100 / window.devicePixelRatio);
  useKeyboardNavigation({
    zoom,
    onOpacityChange: setOpacity,
    onZoomyChange: setZoom,
  });

  return (
    <main>
      <Controls
        opacity={opacity}
        zoom={zoom}
        onOpacityChange={setOpacity}
        onZoomChange={setZoom}
      />
      <DragArea opacity={opacity} zoom={zoom} />
    </main>
  );
}
