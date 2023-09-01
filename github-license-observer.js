// Reference: https://opensource.org/licenses/
//
// It is almost certain that GitHub does not always use the SPDX license name
// for the license field. We will have to test and adapt.
const ossLicenses = [
  "BSD-1-Clause",        // 1-clause BSD License
  "AFL-3.0",             // Academic Free License v. 3.0
  "APL-1.0",             // Adaptive Public License 1.0
  "Apache-2.0",          // Apache License, Version 2.0
  "Apache-1.1",          // Apache Software License, version 1.1
  "APSL-2.0",            // Apple Public Source License 2.0
  "Artistic-1.0-Perl",   // Artistic License (Perl) 1.0
  "Artistic-1.0",        // Artistic License 1.0
  "Artistic-2.0",        // Artistic License 2.0
  "AAL",                 // Attribution Assurance License
  "BSL-1.0",             // Boost Software License 1.0
  "BSD-2-Clause-Patent", // BSD+Patent
  "CECILL-2.1",          // Cea Cnrs Inria Logiciel Libre License, version 2.1
  "CERN-OHL-P-2.0",      // CERN Open Hardware Licence Version 2 – Permissive
  "CERN-OHL-S-2.0",      // CERN Open Hardware Licence Version 2 – Strongly Reciprocal
  "CERN-OHL-W-2.0",      // CERN Open Hardware Licence Version 2 – Weakly Reciprocal
  "CDDL-1.0",            // Common Development and Distribution License 1.0
  "CPAL-1.0",            // Common Public Attribution License Version 1.0
  "CPL-1.0",             // Common Public License Version 1.0
  "CATOSL-1.1",          // Computer Associates Trusted Open Source License 1.1
  "CAL-1.0",             // Cryptographic Autonomy License
  "CUA-OPL-1.0",         // CUA Office Public License
  "EPL-1.0",             // Eclipse Public License -v 1.0
  "EPL-2.0",             // Eclipse Public License version 2.0
  "eCos-2.0",            // eCos License version 2.0
  "ECL-1.0",             // Educational Community License, Version 1.0
  "ECL-2.0",             // Educational Community License, Version 2.0
  "EFL-1.0",             // Eiffel Forum License, version 1
  "EFL-2.0",             // Eiffel Forum License, Version 2
  "Entessa",             // Entessa Public License Version. 1.0
  "EUDatagrid",          // EU DataGrid Software License
  "EUPL-1.2",            // European Union Public License, version 1.2
  "Fair",                // Fair License
  "Frameworx-1.0",       // Frameworx License 1.0
  "AGPL-3.0-only",       // GNU Affero General Public License version 3
  "GPL-2.0",             // GNU General Public License version 2
  "GPL-3.0-only",        // GNU General Public License version 3
  "LGPL-2.1",            // GNU Lesser General Public License version 2.1
  "LGPL-3.0-only",       // GNU Lesser General Public License version 3
  "LGPL-2.0-only",       // GNU Library General Public License version 2
  "HPND",                // Historical Permission Notice and Disclaimer
  "IPL-1.0",             // IBM Public License Version 1.0
  "Intel",               // Intel Open Source License
  "IPA",                 // IPA Font License
  "ISC",                 // ISC License
  "Jam",                 // JAM License
  "LPPL-1.3c",           // LaTeX Project Public License, Version 1.3c
  "BSD-3-Clause-LBNL",   // Lawrence Berkeley National Labs BSD Variant License
  "LiLiQ-P-1.1",         // Licence Libre du Québec – Permissive  version 1.1
  "LiLiQ-Rplus-1.1",     // Licence Libre du Québec – Réciprocité forte version 1.1
  "LiLiQ-R-1.1",         // Licence Libre du Québec – Réciprocité version 1.1
  "LPL-1.02",            // Lucent Public License Version 1.02
  "LPL-1.0",             // Lucent Public License, Plan 9, version 1.0
  "MS-PL",               // Microsoft Public License
  "MS-RL",               // Microsoft Reciprocal License
  "MirOS",               // MirOS License
  "MIT-0",               // MIT No Attribution License
  "Motosoto",            // Motosoto Open Source License
  "MPL-1.1",             // Mozilla Public License 1.1
  "MPL-2.0",             // Mozilla Public License 2.0
  "MPL-1.0",             // Mozilla Public License, version 1.0
  "MulanPSL-2.0",        // Mulan Permissive Software License v2
  "Multics",             // Multics License
  "NASA-1.3",            // NASA Open Source Agreement v1.3
  "Naumen",              // NAUMEN Public License
  "NOKIA",               // Nokia Open Source License Version 1.0a
  "NPOSL-3.0",           // Non-Profit Open Software License version 3.0
  "NTP",                 // NTP License
  "OGTSL",               // Open Group Test Suite License
  "OLFL-1.3",            // Open Logistics Foundation License v1.3
  "OSL-2.1",             // Open Software License 2.1
  "OSL-1.0",             // Open Software License, version 1.0
  "OLDAP-2.8",           // OpenLDAP Public License Version 2.8
  "OSET-PL-2.1",         // OSET Public License version 2.1
  "PHP-3.0",             // PHP License 3.0
  "PHP-3.01",            // PHP License 3.01
  "PSF-2.0",             // Python License, Version 2
  "RPSL-1.0",            // RealNetworks Public Source License Version 1.0
  "RPL-1.5",             // Reciprocal Public License 1.5
  "RPL-1.1",             // Reciprocal Public License, version 1.1
  "OFL-1.1",             // SIL OPEN FONT LICENSE
  "SimPL-2.0",           // Simple Public License
  "SISSL",               // Sun Industry Standards Source License
  "SPL-1.0",             // Sun Public License, Version 1.0
  "BSD-2-Clause",        // The 2-Clause BSD License
  "BSD-3-Clause",        // The 3-Clause BSD License
  "CNRI-Python",         // The CNRI portion of the multi-part Python License
  "EUPL-1.1",            // The European Union Public License, version 1.1
  "MIT",                 // The MIT License
  "NGPL",                // The Nethack General Public License
];

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
    return link.href.match(/LICENSE|COPYING/i);
  });
}

function identifyProjectLicense(licenseLink) {
  // The link is either "<license-name> license" or "View License" if the
  // license was not identified by GitHub.
  const license = licenseLink.text.trim().replace(/ License$/i, "");
  if (license != "View") {
    return license;
  }

  // TODO Fetch the license file
  return "unknown";
}

function isOSSLicense(license) {
  return ossLicenses.find((ossLicense) => license.match(ossLicense)) != null;
}

function annotateProjectPage() {
  const licenseLink = findLicenseLink();
  if (!licenseLink) {
    console.debug("license link not found");
    return;
  }

  const license = identifyProjectLicense(licenseLink);
  console.debug("identified license", license);

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
    title = "The license is an OSI Approved License.";
  } else {
    bgColor = "#c14e4a";
    fgColor = "white";
    text = "not open source";
    title = "The license is not an OSI Approved License.";
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
  label.style.border = "1px solid white";
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
