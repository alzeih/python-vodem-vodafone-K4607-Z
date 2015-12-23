#!/bin/sh

pushd docs
sphinx-apidoc -f -e  -o source ../vodem
sphinx-build -b html . _build/html
popd
