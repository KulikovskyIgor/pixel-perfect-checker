import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { floatToInt, getImageSize } from 'renderer/utils/util';

type DragAreaProps = {
  opacity: number;
  zoom: number;
};

export default function DragArea({ opacity, zoom }: DragAreaProps) {
  const [image, setImage] = useState<string | null>(null);
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
        // eslint-disable-next-line promise/always-return
        .then((size) => {
          const scaledSize = {
            width: (size.width * zoom) / 100,
            height: (size.height * zoom) / 100,
          };
          const windowSize = {
            width: floatToInt(scaledSize.width + 50),
            height: floatToInt(scaledSize.height + 50),
          };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="drag-area">
      <header>Drag & Drop to Upload File</header>
      <span>OR</span>
      <button type="button" onClick={onBrowseFileClick}>
        Browse File
      </button>
    </div>
  );
}
