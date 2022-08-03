import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getImageSize,
  getScaledImageSize,
  getWindowSize,
} from 'renderer/utils/util';
import Help from './Help';

type DragAreaProps = {
  image?: string;
  opacity: number;
  zoom: number;
  setImage: (image: string) => void;
};

export default function DragArea({
  image,
  opacity,
  zoom,
  setImage,
}: DragAreaProps) {
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    {
      width: 0,
      height: 0,
    }
  );
  const opacityAdapted = useMemo(() => {
    if (opacity === 0) return 0;
    return opacity / 100;
  }, [opacity]);

  const onBrowseFileClick = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('open-file');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('read-file', (fileInBase64) => {
      const fileHeader = 'data:image/png;base64,';
      setImage(`${fileHeader}${fileInBase64}`);
    });

    document.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event?.dataTransfer?.files[0];

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(event?.dataTransfer?.files[0]);
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
      }
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }, []);

  useEffect(() => {
    if (image) {
      getImageSize(image)
        .then((size) => {
          const scaledSize = getScaledImageSize(zoom, size);
          const windowSize = getWindowSize(scaledSize);

          setImageSize(scaledSize);
          window.electron.ipcRenderer.sendMessage(
            'set-window-size',
            windowSize
          );
        })
        .catch((e) => {
          console.error('Image size cannot be determined', e.message);
        });
    }
  }, [image, zoom]);

  if (image && imageSize.width) {
    return (
      <div className="drag-area">
        <img
          alt="Shadow data"
          src={image}
          style={{ ...imageSize, opacity: opacityAdapted }}
        />
      </div>
    );
  }

  return <Help onBrowseFileClick={onBrowseFileClick} />;
}
