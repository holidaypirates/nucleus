#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

echo "Deploying ..."

rev=$(git rev-parse --short HEAD)

cd docs/build

git init
git config user.name "Michael Seibt"
git config user.email "michael@bedshaped.de"

git remote add upstream "https://$GH_TOKEN@github.com/holidaypirates/nucleus.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
