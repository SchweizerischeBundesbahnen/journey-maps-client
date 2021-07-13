# Change Log

## [1.6.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F1.5.0&sourceBranch=refs%2Ftags%2F1.6.0&targetRepoId=46287) - 2021-07-13

### Fixed

* Inline SVG in CSS
* Show level switch correctly on initial map load

## [1.5.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F1.4.0&sourceBranch=refs%2Ftags%2F1.5.0&targetRepoId=46287) - 2021-07-12

### Added

* Support for indoor routing

## [1.4.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F1.3.0&sourceBranch=refs%2Ftags%2F1.4.0&targetRepoId=46287) - 2021-07-06

### Added

* Support for markers on multiple sources & layers. Ask us if you need this feature, because your map style has to be
  configured accordingly. Moreover not everything is working. Clustering is not yet supported on additional sources.

## [1.3.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F1.2.0&sourceBranch=refs%2Ftags%2F1.3.0&targetRepoId=46287) - 2021-06-28

### Added

* `levelSwitch` control shows available levels in the currently visible station in map.

## [1.2.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F1.1.0&sourceBranch=refs%2Ftags%2F1.2.0&targetRepoId=46287) - 2021-06-25

### Added

* Optional `scrollZoom` input parameter to disable "scroll to zoom".
* Aria-Label for map controls.

## [1.1.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F1.0.0&sourceBranch=refs%2Ftags%2F1.1.0&targetRepoId=46287) - 2021-04-27

### Changed

* The package name is now all lowercase as it should be  
  (`@schweizerischebundesbahnen` instead of `@SchweizerischeBundesbahnen`)
* DUSP-1297 new styling of zoom controls
* DUSP-1297 allow selecting zoom and level-switch controls with tab key

### Fixed

* Adding & Removal of popup when not clicking the close button
* Fade out animation of teaser
* Peer dependency versions

## [1.0.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.7.2&sourceBranch=refs%2Ftags%2F1.0.0&targetRepoId=46287) - 2021-04-21

### Added

* Our packages are now also available on Github: https://github.com/SchweizerischeBundesbahnen/journey-maps-client

### Changed

* The names of the packages have changed!
  * From `journey-maps-client` to `@SchweizerischeBundesbahnen/journey-maps-client`
  * From `journey-maps-client-elements` to `@SchweizerischeBundesbahnen/journey-maps-client-elements`
* When marker details are displayed in a popup instead of a teaser, position the newly selected marker 1/3 from the top
  of the map

### Fixed

* Change the popup configuration to not emit a 'close' event when clicking outside the popup. Now clicking on the same
  marker again closes the popup, same as we do with the teaser.

## [0.7.2](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.7.1&sourceBranch=refs%2Ftags%2F0.7.2&targetRepoId=46287) - 2021-04-15

### Changed

* enclose the map container inside it's own "stacking context" to prevent internal z-indexes from conflicting with the
  host's page
* Detection mechanism whether the map style is loaded or not. Old solution seemed to be unstable.

## [0.7.1](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.7.0&sourceBranch=refs%2Ftags%2F0.7.1&targetRepoId=46287) - 2021-04-14

### Changed

* moved the import of mapbox-gl.css outside of the library. it should be included by the encompassing app.

## [0.7.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.6.3&sourceBranch=refs%2Ftags%2F0.7.0&targetRepoId=46287) - 2021-04-14

### Changed

* `JourneyMapsClientModule` no longer imports `HttpClientModule` to avoid the creation of multiple instances of it.
  Applications using Journey Maps Client have to import `HttpClientModule` itself.

## [0.6.3](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.6.2&sourceBranch=refs%2Ftags%2F0.6.3&targetRepoId=46287) - 2021-04-12

### Added

* added delay marker category

## [0.6.2](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.6.1&sourceBranch=refs%2Ftags%2F0.6.2&targetRepoId=46287) - 2021-04-08

### Fixed

* expose marker-colors.enum in public-api.ts

## [0.6.1](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.6.0&sourceBranch=refs%2Ftags%2F0.6.1&targetRepoId=46287) - 2021-04-08

### Fixed

* only update journey, transfer and routes if there are changes to one of these 3.

## [0.6.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.5.2&sourceBranch=refs%2Ftags%2F0.6.0&targetRepoId=46287) - 2021-04-07

### Added

* DUSP-1357 Add optional `routes` input parameter to display a list of routes on the map

* DUSP-1240 adds an optional `showLevelSwitch` input parameter. The level switch allows you to switch floors/levels on a
  station map.

* DUSP-1239 adds an optional `popup` input parameter. When `true`marker details will be shown in a popup instead of a
  teaser.

### Changed

* **BREAKING**: DUSP-1357 Rename `journeyGeoJSON` and `transferGeoJSON` to `journey` and `transfer` and change the type
  from `string` to `GeoJSON.FeatureCollection`

* **BREAKING**: DUSP-1239 `infoBoxTemplate` input parameter has been renamed to `markerDetailsTemplate`

## [0.5.2](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.5.1&sourceBranch=refs%2Ftags%2F0.5.2&targetRepoId=46287) - 2021-03-17

### Changed

* reduced the zoom factor for multiTouchSupport from 0.6 to 0.2 for a smoother zooming experience when overlay is active

## [0.5.1](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.5.0&sourceBranch=refs%2Ftags%2F0.5.1&targetRepoId=46287) - 2021-03-17

### Fixed

* DUSP-1314 only use multiTouchSupport.ts when overlay is active.

## [0.5.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.4.0&sourceBranch=refs%2Ftags%2F0.5.0&targetRepoId=46287) - 2021-03-17

### Added

* DUSP-1314 Make 1-Finger panning or overlay configurable (`allowOneFingerPan` input parameter)

### Fixed

* DUSP-1314 Fix disco effect where map jumps with multiple map pan/zoom events in succession by disabling two-way
  binding.
* Initial rendering in Safari

## [0.4.0](https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/compare/commits?targetBranch=refs%2Ftags%2F0.3.1&sourceBranch=refs%2Ftags%2F0.4.0&targetRepoId=46287) - 2021-03-16

### Added

* DUSP-1112 Add optional `boundingBoxPadding` input parameter

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
