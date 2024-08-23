/**
 * ## The dependency identifier
 *
 * You can use any string or Symbol as identifier. The identifier is used to
 * register a class in the TSinjex DI (Dependency Injection) container.
 * See **Hierarchical identifiers** for more information on `.` in identifiers.
 *
 * ### Hierarchical identifiers
 * To create hierarchical identifiers, you can use a dot `.` as a separator.
 * E.g. `Parent.Child` or `Parent.Child.Grandchild`.
 *
 * ### Merge functionality
 * You can merge multiple dependencies into one by resolving them with
 * a identifier that is a prefix of the actual identifiers.
 * E.g. `Parent` resolves `Parent.*` and returns a mixin of all children.
 * Merging will only work, if the main identifier is not registered.
 * Grandchildren are not included in the mixin but you can use something like
 * `Parent.Child.Grandchild` to merge all direct children of Grandchild,
 * e.g. `Parent.Child.Grandchild.*`.
 * If you don't want to allow merging, you must register the dependencies
 * with the full identifier. E.g. `Parent` or `Parent.Child.Grandchild`.
 *
 * ### Naming convention
 * The name of a dependency should generally correspond to the interface that is implemented.
 * E.g. a class `ClassA` that implements the interface `IClassA` and is registered
 * as a dependent class is registered under the interface name `IClassA`.
 *
 * The mixin parts of the class are registered under the interface name `IClassA.*`.
 * E.g. `IClassA.IClassZ`, `IClassA.IClassY`, etc.
 *
 * #### Static/Constructor Identifier naming
 * The identifier for a static or constructor dependency should be the same as the class name
 * postfixed with `_`. E.g. `IClassA_` for the the static or constructor interface of class `IClassA`.
 */
export type Identifier = string | symbol;
