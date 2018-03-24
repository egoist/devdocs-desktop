# DevDocs Desktop

[![version](https://img.shields.io/github/release/egoist/devdocs-desktop.svg?style=flat-square)](https://github.com/egoist/devdocs-desktop/releases)
[![downloads](https://img.shields.io/github/downloads/egoist/devdocs-desktop/total.svg?style=flat-square)](https://github.com/egoist/devdocs-desktop/releases)
[![downloads latest](https://img.shields.io/github/downloads/egoist/devdocs-desktop/latest/total.svg?style=flat-square)](https://github.com/egoist/devdocs-desktop/releases/latest)
[![travis](https://img.shields.io/travis/egoist/devdocs-desktop.svg?style=flat-square)](https://travis-ci.org/egoist/devdocs-desktop)
[![appveyor](https://img.shields.io/appveyor/ci/egoist/devdocs-desktop.svg?style=flat-square)](https://ci.appveyor.com/project/egoist/devdocs-desktop) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat-square)](https://github.com/egoist/donate) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat-square)](https://chat.egoist.moe)

<!--[DevDocs.io](https://devdocs.io/) combines multiple API documentations in a fast, organized, and searchable interface. This is an unoffcial desktop app for it.-->
[DevDocs.io](https://devdocs.io/)は多数のAPIドキュメントを素早く便利にまとめて、探すことのできるインターフェイスです。このデスクトップアプリは非公式です。

![devdocs-preview](https://user-images.githubusercontent.com/8784712/27121730-11676ba8-511b-11e7-8c01-00444ee8501a.png)

## 特徴

### バックグラウンドで動作

<!--When closing the window, the app will continue running in the background, in the dock on macOS and the tray on Linux/Windows. Right-click the dock/tray icon and choose Quit to completely quit the app. On macOS, click the dock icon to show the window. On Linux, right-click the tray icon and choose Toggle to toggle the window. On Windows, click the tray icon to toggle the window. -->
ウィンドウを閉じたとき、アプリはmacOSのdockやLinux/Windowsのトレイにバックグラウンドで動作し続けます。dockやトレイでアイコンを右クリックすると、アプリの終了を選択できます。
macOSではdockでアイコンをクリックすると、ウィンドウが表示されます。
Linuxでは、トレイでアイコンを右クリックすると、ウィンドウの切り替えを選択できます。
Windowsでは、トレイのアイコンをクリックすると、ウィンドウを切り替えます。

<!--### Build-in shortcuts-->

### ショートカットキー

<!--`devdocs` the website itself has great built-in shortcuts support, just check the `help` page in the app.-->
`devdocs` のウェブサイトは素晴らしいショートカットキーをサポートしています。アプリの`help`ページを確認してみましょう。

<img src="https://ooo.0o0.ooo/2017/06/14/59402442301b8.png" alt="help" width="300" />

### グローバルショートカット

<!--Use <kbd>Ctrl+Shift+D</kbd> (or <kbd>Command+Shift+D</kbd> on macOS) to toggle the app.-->
<kbd>Ctrl+Shift+D</kbd> (macOSでは<kbd>Command+Shift+D</kbd>)を押すと、アプリを切り替えします。

## ダウンロード

<!--You can manually download the latest release -->
最新リリースのダウンロードは
[こちら](https://github.com/egoist/devdocs-desktop/releases)

## 開発

このアプリの開発はとても簡単です。Webpackのようなビルドツールは必要ありません。
[./app](/app) をチェックしてください

```bash
npm install

npm run app
# edit files, save, refresh and it's done.
```

## 配布

```bash
npm run dist
```

## ライセンス

MIT &copy; [EGOIST](https://github.com/egoist)
