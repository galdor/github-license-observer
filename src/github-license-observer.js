// Reference: https://opensource.org/licenses/
//
// It is almost certain that GitHub does not always use the SPDX license name
// for the license field. We will have to test and adapt.
const ossLicenses = [
  "AAL", "AFL-3.0", "AGPL-3.0", "APL-1.0", "APSL-2.0", "Apache-1.1",
  "Apache-2.0", "Artistic-1.0", "Artistic-1.0-Perl", "Artistic-2.0",
  "BSD-1-Clause", "BSD-2-Clause", "BSD-2-Clause-Patent", "BSD-3-Clause",
  "BSD-3-Clause-LBNL", "BSL-1.0", "CAL-1.0", "CATOSL-1.1", "CDDL-1.0",
  "CECILL-2.1", "CERN-OHL-P-2.0", "CERN-OHL-S-2.0", "CERN-OHL-W-2.0",
  "CNRI-Python", "CPAL-1.0", "CPL-1.0", "CUA-OPL-1.0", "ECL-1.0", "ECL-2.0",
  "EFL-1.0", "EFL-2.0", "EPL-1.0", "EPL-2.0", "EUDatagrid", "EUPL-1.1",
  "EUPL-1.2", "Entessa", "Fair", "Frameworx-1.0", "GPL-2.0", "GPL-3.0",
  "HPND", "IPA", "IPL-1.0", "ISC", "Intel", "Jam", "LGPL-2.0", "LGPL-2.1",
  "LGPL-3.0", "LPL-1.0", "LPL-1.02", "LPPL-1.3c", "LiLiQ-P-1.1",
  "LiLiQ-R-1.1", "LiLiQ-Rplus-1.1", "MIT", "MIT-0", "MPL-1.0", "MPL-1.1",
  "MPL-2.0", "MS-PL", "MS-RL", "MirOS", "Motosoto", "MulanPSL-2.0", "Multics",
  "NASA-1.3", "NGPL", "NOKIA", "NPOSL-3.0", "NTP", "Naumen", "OFL-1.1",
  "OGTSL", "OLDAP-2.8", "OLFL-1.3", "OSET-PL-2.1", "OSL-1.0", "OSL-2.1",
  "PHP-3.0", "PHP-3.01", "PSF-2.0", "RPL-1.1", "RPL-1.5", "RPSL-1.0", "SISSL",
  "SPL-1.0", "SimPL-2.0", "eCos-2.0",
];

// Built using regexp-opt in Emacs and some manual adjustments since Emacs
// regexps and JS regexps are different.
const ossLicenseREString = "(?:A(?:AL|FL-3.0|GPL-3.0|P(?:(?:L-1|SL-2).0)|pache-(?:1.1|2.0)|rtistic-(?:1.0(?:-Perl)?|2.0))|BS(?:D-(?:1-Clause|2-Clause(?:-Patent)?|3-Clause(?:-LBNL)?)|L-1.0)|C(?:A(?:L-1.0|TOSL-1.1)|DDL-1.0|E(?:CILL-2.1|RN-OHL-(?:[PSW]-2.0))|NRI-Python|(?:PA?|UA-OP)L-1.0)|E(?:CL-(?:[12].0)|FL-(?:[12].0)|PL-(?:[12].0)|U(?:Datagrid|PL-1.[12])|ntessa)|F(?:air|rameworx-1.0)|GPL-(?:[23].0)|HPND|I(?:P(?:A|L-1.0)|SC|ntel)|Jam|L(?:GPL-(?:2.[01]|3.0)|P(?:L-1.02?|PL-1.3c)|iLiQ-(?:(?:Rplus|[PR])-1.1))|M(?:IT(?:-0)?|PL-(?:1.[01]|2.0)|S-(?:[PR]L)|irOS|otosoto|ul(?:anPSL-2.0|tics))|N(?:ASA-1.3|GPL|OKIA|POSL-3.0|TP|aumen)|O(?:FL-1.1|GTSL|L(?:DAP-2.8|FL-1.3)|S(?:ET-PL-2.1|L-(?:1.0|2.1)))|P(?:HP-3.01?|SF-2.0)|RP(?:L-1.[15]|SL-1.0)|S(?:ISSL|(?:PL-1|imPL-2).0)|eCos-2.0)";
const ossLicenseRE = new RegExp(ossLicenseREString, "i");
const ossLicenseREAnchored = new RegExp("^" + ossLicenseREString + "$", "i");
const ossLicenseRESPDXLine =
      new RegExp("SPDX\\s+(?:\\S+\\s+)*(" + ossLicenseREString + ")", "i");

const labelClass = "github-license-observer-label";

function findLicenseLink() {
  const aboutTitle = [...document.querySelectorAll("h2")].find((title) => {
    return title.textContent.trim() == "About";
  });
  if (!aboutTitle) {
    return null;
  }

  const aboutCell = aboutTitle.parentElement;

  return [...aboutCell.querySelectorAll("a")].find((link) => {
    // Examples:
    //
    // /blob/master/LICENSE
    // /blob/main/COPYING.txt
    // /blob/my-branch/LICENSE-Community.txt
    return link.href.match(
      /\/blob\/[^/]+\/(LICENSE|COPYING)([-_][^.]+)?(\.[a-z]+)?$/i);
  });
}

function fetchLicenseFile(uriString) {
  // We must replace https://github.com/<org>/<repo>/blob/<ref>/<subpath>
  // with https://raw.githubusercontent.com/<org>/<repo>/<ref>/LICENSE
  const uri = new URL(uriString);

  uri.hostname = "raw.githubusercontent.com";

  const path = uri.pathname;

  var segments = path.slice(1).split("/");
  if (segments.length < 4 || segments[2] != "blob") {
    console.error("invalid uri", uri);
    return;
  }

  segments = segments.slice(0, 2).concat(segments.slice(3));
  uri.pathname = "/" + segments.join("/");

  console.info("downloading license file from", uri.href);

  var req = new XMLHttpRequest();
  req.open("GET", uri.href, false);
  req.send();

  if (req.status < 200 || req.status > 299) {
    console.error("cannot fetch", uri.href, ":", "request failed with status",
                  req.status);
    return;
  }

  return req.responseText;
}

function identifyProjectLicense(licenseLink) {
  // The link is either "<license-name> license" or "View License" if the
  // license was not identified by GitHub.
  const license = licenseLink.text.trim().replace(/ License$/i, "");
  if (license != "View") {
    return license;
  }

  const text = fetchLicenseFile(licenseLink.href);
  if (text == null) {
    return;
  }

  // We are in uncharted territory. There is no standard format for licenses
  // so we have to try and hope for the best.
  //
  // See https://spdx.org/licenses/ for SPDX license identifiers.

  // Some licenses add a header containing a SPDX identifier, for example
  // https://github.com/microcosm-cc/bluemonday. Infortunately there is no
  // standard format for this header, so check if it somehow looks like a SPDX
  // header followed by a license we know about (i.e. one of the OSS
  // licenses).
  const firstLine = text.match(/^.*$/m)[0];
  const firstLineMatch = firstLine.match(ossLicenseRESPDXLine);

  if (firstLineMatch) {
    return firstLineMatch[1];
  } else if (text.match(/^Business Source License 1.1$/im)) {
    // E.g. https://github.com/hashicorp/terraform/blob/main/LICENSE
    return "BUSL-1.1";
  } else if (text.match(/^\s*Server Side Public License$/im)
             && text.match(/\s*VERSION 1,/im)) {
    // E.g. https://github.com/mongodb/mongo/blob/master/LICENSE-Community.txt
    return "SSPL-1.0";
  }
}

function isOSSLicense(license) {
  return !!license.toLowerCase().match(ossLicenseREAnchored);
}

function annotateProjectPage() {
  const licenseLink = findLicenseLink();
  if (!licenseLink) {
    console.info("license link not found");
    return;
  }

  const license = identifyProjectLicense(licenseLink);
  if (!license) {
    console.info("cannot identify license");
    return;
  }

  console.info("identified license", license);

  var text, bgColor, fgColor, title

  if (license == "unknown") {
    bgColor = "#4c8cdc";
    fgColor = "white";
    text = "unknown";
    title = "The license cannot be identified.";
  } else if (isOSSLicense(license)) {
    bgColor = "#347d39";
    fgColor = "white";
    text = "open source";
    title = `The ${license} license is an OSI Approved License.`;
  } else {
    bgColor = "#c14e4a";
    fgColor = "white";
    text = "not open source";
    title = `The ${license} license is not an OSI Approved License.`;
  }

  const label = createLicenseLabel(text, title, fgColor, bgColor);

  document.querySelectorAll("."+labelClass).forEach((label) => {
    label.remove();
  });

  licenseLink.parentElement.appendChild(label);
}

function createLicenseLabel(text, title, fgColor, bgColor) {
  const label = document.createElement("span");

  label.classList.add(labelClass);

  label.appendChild(document.createTextNode(text));

  label.title = title;

  label.style.marginLeft = "4px";
  label.style.borderRadius = "6px";
  label.style.padding = "1px 4px";
  label.style.backgroundColor = bgColor;
  label.style.color = fgColor;
  label.style.fontSize = "0.8rem";
  label.style.fontVariant = "small-caps";
  label.style.cursor = "default";

  return label;
}

annotateProjectPage();
