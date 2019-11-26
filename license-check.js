'use strict';

/*
For SVG-edit

Note that default of MIT excludes mention of MIT packages

In the list that follows, these are already present in https://github.com/jslicense/npm-license-corrections.json/edit/master/index.csv
  - deep-is (0.1.3)

1. Note that as far as manual corrections, esutils has been fixed in
  `master` and `json-schema` has been fixed with a release:
  https://github.com/joyent/node-jsprim/issues/27

1. Waiting on whether might avoid need for specifying `licenses`/`packages`
   as alluded to in comment at https://github.com/jslicense/licensee.js/pull/61
1. Waiting: Since specifying, OSI, wondering why "Unlicense", which has a valid format,
  is not OSI-recognized: https://github.com/unlicense/unlicense.org/issues/72

1. Waiting: Ok license, but could use better parsing (would also need
    dependencies to update):
  1. "MIT" but has [bad format](https://github.com/thlorenz/deep-is/pull/7):
      https://github.com/thlorenz/deep-is
  1. Fixed format ("MIT") but hasn't put into new npm release (latest: 1.1.2):
      https://github.com/gkz/prelude-ls/issues/121
2. Has valid format ("(AFL-2.1 OR BSD-3-Clause)") but last release (0.2.3) using `licenses`:
  https://github.com/kriszyp/json-schema
*/

const {join} = require('path');
const licensee = require('licensee');
// eslint-disable-next-line import/no-dynamic-require
const {bundledRootPackages} = require(
  join(process.cwd(), 'licenseInfo.json')
);

licensee(
  {
    // Add prelude-ls (1.1.2) to corrections?
    // - Automatic corrections is reason prelude-ls (1.1.2) is ok when
    //    `corrections` is on, despite not being in list
    // - Appears may have only been bad without `corrections` as last version was
    //    using `licenses`, not because of OR:
    //     why is json-schema (0.2.3) "(AFL-2.1 OR BSD-3-Clause)" showing up ok
    //     with its OR conjunction when `corrections` is on
    // The manual corrections are useful but automatic ones are critical
    //   handling old objects, arrays of objects etc.
    corrections: true,
    packages: {
      // 'load-stylesheets': '*'
    },
    filterPackages (packages) {
      const filteredPackages = packages.filter((pkg) => {
        // Ensure we are getting a package with the version set in the
        //  user's package.json
        // Could also be a normal dep. if, e.g., copying for browser;
        //   but normally will be whitelisting devDep. that we are copying
        //   over
        // const isRootDep = pkg.package._requiredBy.includes('#USER');
        const isRootDevDep = pkg.package._requiredBy.includes('#DEV:/');
        return isRootDevDep && bundledRootPackages.includes(pkg.name);
      });

      // eslint-disable-next-line jsdoc/require-jsdoc
      function getDeps (pkgs) {
        pkgs.forEach(({package: {dependencies}}) => {
          if (dependencies) {
            const pkgsToCheck = [];
            Object.keys(dependencies).forEach((dep) => {
              const findPkg = ({name}) => dep === name;
              /* eslint-disable unicorn/no-fn-reference-in-iterator */
              if (filteredPackages.find(findPkg)) {
                return;
              }
              const pk = packages.find(findPkg);
              /* eslint-enable unicorn/no-fn-reference-in-iterator */
              pkgsToCheck.push(pk);
              filteredPackages.push(pk);
            });
            getDeps(pkgsToCheck);
          }
        });
      }

      getDeps(filteredPackages);

      // console.log('filteredPackages', filteredPackages.map((fp) => fp.name).sort());
      return filteredPackages;
    },
    licenses: {
      // osi: true
      spdx: [
        'MIT', 'ISC', 'BSD-3-Clause', 'BSD-2-Clause', 'Apache-2.0', 'Unlicense'
      ]
    }
  },
  join(__dirname),
  // Rejected changing implementation of `licensee` to Promise: https://github.com/jslicense/licensee.js/pull/55#issuecomment-558437231
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  (err, results) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('Error', err);
      return;
    }
    /**/
    // console.log('results', results);
    console.log('Approved', JSON.stringify(results.filter((r) => r.approved).reduce((obj, {name, version, license /* , repository: {url} */}) => {
      if (!obj[license]) {
        obj[license] = [];
      }
      // obj[license].push(url);
      // Might be in here as a different version
      if (!obj[license].includes(name)) {
        obj[license].push(name);
        obj[license].sort();
      }
      return obj;
    }, {}), null, 2));
    console.log('Non-approved', results.filter((r) => !r.approved).map(({license, version, repository: {url}}) => {
      return {license, url, version};
    }));
    // To get automatic corrections, really need to omit `corrections` and
    //  look at non-approved, since `correct-license-metadata.js` does
    //  not return a value distinguishing a valid from corrected and
    //  licensee.js does not do its own checking
    console.log('Manually corrected', results.filter((r) => r.corrected === 'manual').map(({name}) => (name)).sort());
  }
);
