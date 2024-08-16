import { TSinjex } from '../classes/TSinjex';
import { Identifier } from '../types/Identifier';

/**
 * A decorator to register a class in the **TSinjex** DI (Dependency Injection) container.
 * @template TargetType The type of the class to be registered.
 * @param identifier The identifier used to register the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param deprecated If true, the dependency is deprecated and a warning
 * is logged only once upon the first resolution of the dependency.
 * @returns The decorator function to be applied on the class.
 * @example
 * ```ts
 * \@Register('MyClassIdentifier')
 * class MyClass {
 *   // ...
 * }
 * ```
 */
export function Register<
    TargetType extends new (...args: unknown[]) => InstanceType<TargetType>,
>(identifier: Identifier, deprecated?: boolean) {
    return function (constructor: TargetType, ...args: unknown[]): void {
        // Get the instance of the DI container
        const diContainer = TSinjex.getInstance();

        // Register the class in the DI container
        diContainer.register(identifier, constructor, deprecated);
    };
}
