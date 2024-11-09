# hide-applied-jobs-linkedin

[link-rgh]: https://github.com/sindresorhus/refined-github
[link-ngh]: https://github.com/sindresorhus/notifier-for-github
[link-hfog]: https://github.com/sindresorhus/hide-files-on-github
[link-tsconfig]: https://github.com/sindresorhus/tsconfig
[link-options-sync]: https://github.com/fregante/webext-options-sync
[link-cws-keys]: https://github.com/fregante/chrome-webstore-upload-keys
[link-amo-keys]: https://addons.mozilla.org/en-US/developers/addon/api/key

A simple chrome plugin that hides jobs already applied to in the LinkedIn job search.

![Sample extension options output](source/icon.png)

## Features

- Identifies and hides jobs in the list shown by LinkedIn when searching for jobs.

## Template

- This browser extension used the [browser-extension-template](https://github.com/fregante/browser-extension-template) as a starting point for development.

## Getting started

### 🛠 Build locally

1. Checkout the copied repository to your local machine eg. with `git clone https://github.com/Robert01101101/hide-applied-jobs-linkedin/`
1. Run `npm install` to install all required dependencies
1. Run `npm run build`

The build step will create the `distribution` folder, this folder will contain the generated extension.

### 🏃 Run the extension

Using [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) is recommended for automatic reloading and running in a dedicated browser instance. Alternatively you can load the extension manually (see below).

1. Run `npm run watch` to watch for file changes and build continuously
1. Run `npm install --global web-ext` (only only for the first time)
1. If you're using `web-ext`: In another terminal, run `web-ext run -t chromium`

#### Manually

You can also [load the extension manually in Chrome](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#google-chrome-opera-vivaldi) or [Firefox](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#mozilla-firefox).