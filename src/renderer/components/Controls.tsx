import React, { useCallback, useEffect, useState } from 'react';

type ControlsProps = {
  opacity: number;
  zoom: number;
  onOpacityChange: (opacity: number) => void;
  onZoomChange: (opacity: number) => void;
};

export default function Controls({
  opacity,
  zoom,
  onOpacityChange,
  onZoomChange,
}: ControlsProps) {
  const [isAlwaysOnTop, setAlwaysOnTop] = useState(true);
  const handleOnTopChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      setAlwaysOnTop(checked);
      window.electron.ipcRenderer.sendMessage('set-on-top', checked);
    },
    []
  );
  const handleOpacityChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onOpacityChange(Number(event.target.value));
    },
    [onOpacityChange]
  );
  const handleZoomChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onZoomChange(Number(event.target.value));
    },
    [onZoomChange]
  );

  useEffect(() => {
    if (isAlwaysOnTop) {
      window.electron.ipcRenderer.sendMessage('set-on-top', true);
    }
  }, []);

  return (
    <header className="controls">
      <label>
        Always On Top
        <input
          name="isGoing"
          type="checkbox"
          checked={isAlwaysOnTop}
          onChange={handleOnTopChange}
        />
      </label>
      <label>
        Opacity
        <input
          type="range"
          min={0}
          max={100}
          value={opacity}
          step={1}
          onChange={handleOpacityChange}
        />
      </label>
      <label>
        Zoom
        <input
          type="number"
          min={1}
          max={100}
          value={zoom}
          step={1}
          onChange={handleZoomChange}
        />
      </label>
    </header>
  );
}
