import Mousetrap from 'mousetrap';
import { APP_WINDOW_HEIGHT, APP_WINDOW_WIDTH } from 'renderer/constants/common';

const ZOOM_KEYS = ['-', '=', '+'];
const OPACITY_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const NAV_KEYS = ['up', 'down', 'left', 'right'];
const RESET_KEYS = ['command+r', 'r'];
const ALL_KEYS = [...ZOOM_KEYS, ...OPACITY_KEYS, ...NAV_KEYS, ...RESET_KEYS];

type KeyboardNavigationProps = {
  zoom: number;
  onOpacityChange: (opacity: number) => void;
  onZoomyChange: (zoom: number) => void;
  onResetPress: (reset: undefined) => void;
};

export default function useKeyboardNavigation(
  {
    zoom,
    onOpacityChange,
    onZoomyChange,
    onResetPress,
  }: KeyboardNavigationProps = {} as KeyboardNavigationProps
) {
  ALL_KEYS.forEach((key) => {
    Mousetrap.bind(key, (_: unknown, pressedKey: string) => {
      if (NAV_KEYS.includes(pressedKey)) {
        window.electron.ipcRenderer.sendMessage('key-press', pressedKey);
      }
      if (OPACITY_KEYS.includes(pressedKey)) {
        const opacity = pressedKey === '0' ? 100 : Number(pressedKey) * 10;
        onOpacityChange(opacity);
      }
      if (ZOOM_KEYS.includes(pressedKey)) {
        if ((pressedKey === '+' || pressedKey === '=') && zoom < 100) {
          onZoomyChange(zoom + 1);
        }
        if (pressedKey === '-' && zoom > 1) {
          onZoomyChange(zoom - 1);
        }
      }
      if (RESET_KEYS.includes(pressedKey)) {
        onResetPress(undefined);
        window.electron.ipcRenderer.sendMessage('set-window-size', {
          width: APP_WINDOW_WIDTH,
          height: APP_WINDOW_HEIGHT,
        });
      }
    });
  });
}
