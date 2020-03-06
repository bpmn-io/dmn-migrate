# Changelog

All notable changes to [dmn-migrate](https://github.com/bpmn-io/dmn-migrate) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.4.3

* `FIX`: gracefully handle missing `biodi:Edge#source` ([#18](https://github.com/bpmn-io/dmn-migrate/issues/18))

## 0.4.2

* `FIX`: generate semantic ids for DMNDI elements

## 0.4.1

* `CHORE`: export `{ TARGET_DMN_VERSION }`

## 0.4.0

* `FEAT`: only fail on migration, not on import errors ([#16](https://github.com/bpmn-io/dmn-migrate/issues/16))
* `CHORE`: handle broken input

## 0.3.1

* `FIX`: generate IDs for newly created DI elements

## 0.3.0

* `FEAT`: support migration from DMN 1.2 to DMN 1.3
* `CHORE`: moved cli to `bpmn-io/dmn-migrate-cli`
* `CHORE`: simplify API

## 0.1.1

* `FIX`: correctly handle DMN 1.3 diagrams

## 0.1.0

* `FEAT`: initial version :tada:
