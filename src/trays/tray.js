import {Tray, Menu, MenuItem, clipboard} from 'electron';
import storage from 'electron-json-storage';
import isURL from 'is-url';
import WindowAction from 'actions/window-action';
import browserwindowStore from 'stores/browserwindow-store';

const iconPath = __dirname + '/icons/tray.png';
const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Open from Clipboard',
    click() {
      const text = clipboard.readText();
      if (isURL(text)) {
        WindowAction.create({
          url: text,
        });
      }
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Bookmarks',
    submenu: [],
  }
]);

export default {
  create() {
    const trayIcon = new Tray(iconPath);
    getBookmarks()
      .then(() => trayIcon.setContextMenu(contextMenu));
    trayIcon.setToolTip('Reffist');
  }
};

async function getBookmarks() {
  const bookmarksSubMenu = contextMenu.items[2].submenu;
  const {data} = await storage.get('bookmark');
  if (!Array.isArray(data)) return;

  data.forEach(({title, url}) => {
    const menuItem = new MenuItem({
      label: title,
      click() {
        console.log(url);
      },
    });
    bookmarksSubMenu.append(menuItem);
  });
}
