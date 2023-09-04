# GitHub License Observer
## Project
This project is a small Firefox add-on that annotates GitHub pages to clearly
indicate whether the license is an actual Open Source license or not.

![](screenshots/not-oss.png)

## Usage
This add-on is available on the [official Mozilla extension
website](https://addons.mozilla.org/addon/github-license-observer).

You can also temporarily install the development version. To do so:

- Clone the repository.
- Open "about:debugging" in Firefox.
- Select the "This Firefox" tab.
- Click the "Load Temporary Add-on…" button.
- Select the `manifest.json` file.

You can then navigate to any GitHub project page and see a label displayed
next to the license link on the right side of the page.

The label is green for Open Source licenses, red for licenses whose name does
not match any known Open Source license, and blue when the license could not
be identified.

## Contributions
This add-on uses the license identifier displayed by GitHub if there is one,
and falls back to analyzing the license file if there is not.

Matching custom licenses is hard. Feel free to open an issue for any
identification error!

## Licensing
This add-on is open source software distributed under the
[ISC](https://opensource.org/licenses/ISC) license.
