import { TSinjex } from '../classes/TSinjex';
import { IdentifierRequiredError } from '../interfaces/Exceptions';
import { Identifier } from '../types/Identifier';

/**
 * A decorator to register a class in the **TSinjex** DI (Dependency Injection) container.
 * @template TargetType The type of the class to be registered.
 * @param identifier The {@link Identifier|identifier} used to register the class in the DI container or the class name if not provided.
 * @param deprecated If true, the dependency is deprecated and a warning is logged only once upon the first resolution of the dependency.
 * @returns The decorator function to be applied on the class.
 * @throws An {@link IdentifierRequiredError} if the identifier is not provided and the class name is not available.
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
>(identifier?: Identifier, deprecated?: boolean) {
    return function (
        constructor: TargetType,
        context: ClassDecoratorContext<TargetType>,
    ) {
        const _identifier = identifier ?? context.name;

        if (_identifier == null) throw new IdentifierRequiredError();

        const diContainer = TSinjex.getInstance();
        diContainer.register(_identifier, constructor, deprecated);
    };
}
