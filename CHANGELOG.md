# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- feat: Add new `IdentifierRequiredError` class for missing identifiers.
- feat: Add the option to use the decorators without passing the identifier: In this case, the identifier will be the class name (register) or the property name (inject).
- Add pre release building to release workflow on dev/* branches an version changes.

### Deprecated


### Removed

- feat!: Disable `experimentalDecorators` and `emitDecoratorMetadata` in the `tsconfig.json` file to reflect the change to the stable decorators api.

### Fixed

- feat!: Update `Register`, `RegisterInstance` and `Inject` decorators to reflect the change to the stable decorators api.
- feat!: Update `Inject` Decorator typing to reflect the correct property type.

### Security


## [0.0.14]

### Added

- Added **ChangeLog** file and format it according to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Added reference to **Semantic Versioning** in the changelog file. (History will be updated on time).
- Version format is now `v0.0.0` instead of `0.0.0`. Changes to this are also reflected in the workflos.
- Add `Identifiers` and `Jest` Sections to the `README.md` file.
- feat: Add new Error `InitializationError` to reflect errors during initialization of a dependency.
- feat: Add initialization error handling and refactor Inject.
- feat: After injecting a dependency, the lazzy loading getter will be replaced with the dependency itself.
- feat: remove the use of a private property to store the injected dependencies. Now the dependencies are stored in the property itself.
- test: Add tests for the new features.


### Deprecated

- Deprecated the old version format `0.0.0`.

### Removed


### Fixed


### Security


---

[unreleased]: https://github.com/PxaMMaxP/TSinjex/compare/0.0.14...HEAD
[0.0.14]: https://github.com/PxaMMaxP/TSinjex/compare/0.0.13...v0.0.14