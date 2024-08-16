import { Identifier } from 'src/types/Identifier';
import { TSinjex } from '../classes/TSinjex';
import { InitDelegate } from '../types/InitDelegate';

/**
 * A decorator to register an instance of a class in the DI (Dependency Injection) container.
 * @template TargetType The type of the class whose instance is to be registered.
 * @param identifier The identifier used to register the instance in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param init An optional initializer function which get the constructor of the class
 * as input and returns an instance of the class.
 * @see {@link InitDelegate} for more information on initializer functions.
 * @returns The decorator function to be applied on the class.
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
    identifier: Identifier,
    init?: InitDelegate<
        TargetType & { new (..._args: unknown[]): InstanceType<TargetType> },
        InstanceType<TargetType>
    >,
) {
    return function (constructor: TargetType, ...args: unknown[]): void {
        // Get the instance of the DI container
        const diContainer = TSinjex.getInstance();
        let instance: InstanceType<TargetType>;

        // Create a proxy to instantiate the class when needed (Lazy Initialization)
        let lazyProxy: unknown = new Proxy(
            {},
            {
                get(target, prop, receiver) {
                    if (instance == null) {
                        if (init) {
                            instance = init(constructor);
                        } else {
                            instance = new constructor(...args);
                        }
                    }
                    lazyProxy = instance;

                    // Return the requested property of the instance
                    return instance[prop as keyof InstanceType<TargetType>];
                },
                set(target, prop, value, receiver) {
                    if (instance == null) {
                        if (init) {
                            instance = init(constructor);
                        } else {
                            instance = new constructor(...args);
                        }
                    }
                    lazyProxy = instance;

                    // Set the requested property of the instance
                    return (instance[prop as keyof InstanceType<TargetType>] =
                        value);
                },
            },
        );

        // Register the lazy proxy in the DI container
        diContainer.register(identifier, lazyProxy);
    };
}
