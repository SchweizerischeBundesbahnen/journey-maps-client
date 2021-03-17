# Change Log

## [Unreleased] - yyyy-mm-dd

### Added

### Changed

### Fixed

* DUSP-1314 Make 1-Finger panning or overlay configurable
* DUSP-1314 Fix disco effect where map jumps with multiple map pan/zoom events in succession by disabling two-way
  binding.
* Initial rendering in Safari

## [0.4.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.3.1&sourceBranch=refs%2Ftags%2F0.4.0&targetRepoId=46287) - 2021-03-16

### Added

* DUSP-1112 Add optional `boundingBoxPadding` input parameter

### Changed

### Fixed

* Lazy loading of JourneyMapsClientModule. (No imports of BrowserModule & BrowserAnimationsModule)

## [0.3.1](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.3.0&sourceBranch=refs%2Ftags%2F0.3.1&targetRepoId=46287) - 2021-03-15

### Fixed

* Panning with two fingers

## [0.3.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.2.1&sourceBranch=refs%2Ftags%2F0.3.0&targetRepoId=46287) - 2021-03-09

### Added

* DUSP-1177 Unless `infoBoxTemplate` is defined, only show teasers for markers containing infoBlocks
* DUSP-1177 Clients of this component can select/unselect markers and receive events of same.
* DUSP-1177 Hidden overflow for teaser transitions
* DUSP-1179 Add optional `boundingBox` input parameter
* DUSP-1179 Add optional `zoomToMarkers` input parameter
* DUSP-1179 Add optional `markerUrl` to Marker
* DUSP-1179 Add optional `triggerEvent` to Marker
* DUSP-1274 Add optional `priority` to Marker
* DUSP-1112 Add optional `journeyGeoJSON` input parameter to display a journey on the map.\
  (The GeoJSON is the response as returend by the `/journey` operation of Journey-Maps)
* DUSP-1112 Add optional `transferGeoJSON` input parameter to display a transfer on the map.\
  (The GeoJSON is the response as returend by the `/transfer` operation of Journey-Maps)
* DUSP-1112 Use new KI map style


### Changed

* DUSP-1260 Preserve selected marker and teaser when adding new markers
* DUSP-1179 Deactivate scroll zoom if user touch the touch display
* DUSP-1179 Replace default touch zoom and pan implementation with custom two fingers interaction
* DUSP-1179 Move teaser to the left side

### Fixed

* DUSP-1260 Preserve selected marker and teaser when adding new markers
* DUSP-1261 Use the correct image name when checking if custom images have already been added
* DUSP-1179 Map resize if container resize

## [0.2.1](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.2.0&sourceBranch=refs%2Ftags%2F0.2.1&targetRepoId=46287) - 2021-01-17

### Changed

(Minor) version updates of Node dependencies.

## [0.2.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.1.1&sourceBranch=refs%2Ftags%2F0.2.0&targetRepoId=46287) - 2021-01-04

### IMPORTANT

You need a new API key when upgrading to this version. Please sign up
for `Journey-Maps-Tiles` [here](https://developer.sbb.ch/apis/journey-maps-tiles/information).

### Added

* We added a search bar to filter the markers on the map. The search bar can be hidden using the input
  parameter `enableSearchBar`.
* Teaser/Infobox is now closeable with `ESC` key.
* ESTA typography CSS to web component version.

### Changed
 * Use internal Tile Server instead of MapTiler.
 * Use  _Base Bright V2 BVI_ style. 
 * Update from Angular 10 to Angular 11.
 * Update various node dependencies.
 
### Fixed
* Various accessibility improvements.

## [0.1.1](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.1.0&sourceBranch=refs%2Ftags%2F0.1.1&targetRepoId=46287) - 2020-11-09
### Fixed
* Fixed an error which caused custom icons to be loaded more than once.

## [0.1.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.0.7&sourceBranch=refs%2Ftags%2F0.1.0&targetRepoId=46287) - 2020-11-04
### Added
* `journey-maps-client-elements` project added. It contains a Web Component version of the component. (Built with Angular Elements)
* Compodoc API documentation added

### Changed
* `ChangeDetectionStrategy.OnPush` for main component

## 0.0.9 - 2020-11-04 [YANKED]
## 0.0.8 - 2020-11-04 [YANKED]

## [0.0.7](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/browse?at=refs%2Ftags%2F0.0.7) - 2020-10-14
### Added
* This is the first "stable" release.
* The library `journey-maps-client` contains the custom Angular component.
