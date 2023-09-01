# GitHub License Observer
## Project
This project is a small Firefox add-on that annotates GitHub pages to clearly
indicate whether the license is an actual Open Source license or not.

## Usage
This add-on is currently in development and is not available as a packaged
add-on. To try it out:

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

In the current state, the add-on only relies on the license identifier
displayed by GitHub. Custom license analysis will be added soon.

Feel free to open an issue for any identification error.

## Licensing
This add-on is open source software distributed under the
[ISC](https://opensource.org/licenses/ISC) license.
