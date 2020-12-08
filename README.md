## DualSense5 Support in Chrome
Extends the Gamepad API to let you use your controller in Chrome for sites like Stadia.

## Usage
- Uploading the Chrome Store right now and will update this when it's live there
- `git clone https://github.com/thayallans/ds5chrome.git` to your local machine
- `chrome://extensions` in Chrome and Turn on Developer Mode
- Select Load Unpacked and navigate to the `ds5chrome` directory

## How it works
We hook the getGamepads function from the Gamepad API and emulate a workable controller when a DualSense Controller is detected

## Pull requests
All pull requests are welcome! Please feel free to improve ControlStadia as you see fit, there's many improvements to be made!

## Disclaimer
I've only tested this on Chrome for Mac. Feel free to test on Windows and/or make a PR to add support for Windows.
