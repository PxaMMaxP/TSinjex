/**
 * The dependency identifier.
 * You can use any string as identifier.
 * To create order, it is also possible to
 * provide these with a separator: `GroupA.ClassZ`.
 * The convection for naming is as follows:
 * The name should generally correspond to the interface that is relevant.
 * I.e. a class `ClassA` that implements the interface `IClassA` and is
 * registered as a dependent class is registered under the interface name `IClassA`.
 */
export type Identifier = string | symbol;
