![icon-1](https://github.com/user-attachments/assets/3f722944-90cd-4485-a537-f74ce40f4bf9)

# One-Click LinkedIn Contact Copier

[![forthebadge](http://forthebadge.com/images/badges/made-with-javascript.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

A Firefox extension that allows for one click copying and formatting for Google sheets of name, url, and job title on LinkedIn for all non-pinned, open tabs, of the current browser window. 

It's very specific to own private current use case workflow and is barebones with no options or settings. 

However, it does exactly what I want it to do: For all non-pinned tabs of the given window, find and copy the afore mentioned text and format it in tab-delimited format for simple paste into a google sheet document. 

As this was developed my my own private workflow, there is no error handling. The extension expects all tabs to be LinkedIn tabs and doesn't check or handle if they aren't. Also the Job title logic may break because LinkedIn's DOM is highly obfuscated.

# Usage

Pin the extension after loading. Then click the button to copy.

# Installation

Temporary Installation (for testing)

1. Open Firefox and go to: ```about:debugging```

2. Click "This Firefox" (on the left sidebar).

3. Click "Load Temporary Add-on":

4. Navigate to your extension’s folder and select the manifest.json file.

5. The extension will install temporarily and stay active until you restart Firefox.




