import { IdentifierRequiredError } from 'src/interfaces/Exceptions';
import { TSinjex } from '../classes/TSinjex';
import { Identifier } from '../types/Identifier';
import { InitDelegate } from '../types/InitDelegate';

/**
 * A decorator to register an instance of a class in the DI (Dependency Injection) container.
 * @template TargetType The type of the class whose instance is to be registered.
 * @param identifier The {@link Identifier|identifier} used to register the class in the DI container or the class name if not provided.
 * @param init An optional initializer {@link InitDelegate|function} which get the constructor of the class
 * as input and returns an instance of the class.
 * @returns The decorator function to be applied on the class.
 * @throws An {@link IdentifierRequiredError} if the identifier is not provided and the class name is not available.
 * @example
 * ```ts
 * \@RegisterInstance('MyClassInstanceIdentifier', (constructor) => new constructor())
 * class MyClass {
 *   // ...
 * }
 * ```
 */
export function RegisterInstance<
    TargetType extends new (..._args: unknown[]) => InstanceType<TargetType>,
>(
    identifier?: Identifier,
    init?: InitDelegate<
        TargetType & { new (..._args: unknown[]): InstanceType<TargetType> },
        InstanceType<TargetType>
    >,
) {
    return function (
        constructor: TargetType,
        context: ClassDecoratorContext<TargetType>,
    ): void {
        const _identifier = identifier ?? context.name;

        if (_identifier == null) throw new IdentifierRequiredError();

        const diContainer = TSinjex.getInstance();
        let instance: InstanceType<TargetType>;

        /**
         * Get the instance of the class
         * and replace the lazy proxy with the instance
         * for performance optimization.
         */
        const getAndRegisterInstance = (): void => {
            if (instance == null) {
                if (init) {
                    instance = init(constructor);
                } else {
                    instance = new constructor();
                }
            }
            diContainer.register(_identifier, instance);
        };

        // Create a proxy to instantiate the class when needed (Lazy Initialization)
        const lazyProxy: unknown = new Proxy(
            {},
            {
                get(_target, prop, _receiver) {
                    getAndRegisterInstance();

                    // Return the requested property of the instance
                    return instance[prop as keyof InstanceType<TargetType>];
                },
                set(_target, prop, value, _receiver) {
                    getAndRegisterInstance();

                    // Set the requested property of the instance
                    return (instance[prop as keyof InstanceType<TargetType>] =
                        value);
                },
            },
        );

        diContainer.register(_identifier, lazyProxy);
    };
}
