#!/bin/bash

set -eu

# Export the logo from SVG to PNG. Some Linux distros get inkscape > 1.0 and
# others get inkscape < 1.0. So I need to change the command line options
# based on the version.
#
# This is tricky. Due to quirks in bash regex matching, the regex must be in a
# variable, and I can't use quotes in the test.
inkscape_version=$(inkscape --version)
inkscape_0_regex="^Inkscape 0"
if [[ ${inkscape_version} =~ ${inkscape_0_regex} ]]
then
  export_option="--export-png"
else
  export_option="--export-filename"
fi
inkscape \
  --without-gui \
  --export-width 256 \
  --export-height 256 \
  ${export_option} images/logo.png \
  images/logo.svg

npm run compile
