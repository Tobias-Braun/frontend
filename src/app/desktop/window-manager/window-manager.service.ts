import {Injectable} from '@angular/core';
import {Window, WindowPosition} from '../window/window';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  windows: Window[] = [];
  activeWindow: Window;

  constructor() {
  }

  findWindow(position: WindowPosition) {
    return this.windows.find(win => win.position === position);
  }

  openWindow(win: Window) {
    this.windows.push(win);
    if (this.activeWindow) {
      this.activeWindow.position.active = false;
      win.position.zIndex = this.activeWindow.position.zIndex + 1;
    }
    win.position.active = true;
    this.activeWindow = win;
  }

  sortWindows() {
    if (this.windows.length === 0) {
      this.activeWindow = null;
      return;
    }

    this.windows.sort((a, b) => a.position.zIndex - b.position.zIndex);
    let highestZIndex = 1;
    for (const win of this.windows) {
      win.position.zIndex = highestZIndex++;
      win.position.active = false;
    }
    this.activeWindow = this.windows[this.windows.length - 1];
    this.activeWindow.position.active = true;
  }

  closeWindow(window: Window) {
    this.windows.splice(this.windows.findIndex(win => win === window), 1);
    this.sortWindows();
  }

  focusWindow(window: Window) {
    window.position.active = true;
    if (this.activeWindow === window) {
      return;
    }

    window.position.zIndex = this.windows[this.windows.length - 1].position.zIndex + 1;
    this.sortWindows();
  }

  unfocus() {
    if (this.activeWindow) {
      this.activeWindow.position.active = false;
      this.activeWindow = null;
    }
  }

}