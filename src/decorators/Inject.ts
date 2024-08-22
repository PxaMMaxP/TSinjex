import {
    DependencyResolutionError,
    InitializationError,
    InjectorError,
    NoInstantiationMethodError,
} from 'src/interfaces/Exceptions';
import { TSinjex } from '../classes/TSinjex';
import { Identifier } from '../types/Identifier';
import { InitDelegate } from '../types/InitDelegate';

/**
 * A decorator to inject a dependency from a DI (Dependency Injection) container into a class property.
 * @template T The type of the dependency to be injected.
 * @template U The type of the property to be injected.
 * @param identifier The identifier used to resolve the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param init Optional an initializer function to transform the dependency before injection
 * or true to instantiate the dependency if it has a constructor.
 * @see {@link InitDelegate} for more information on initializer functions.
 * @param necessary If true, throws an error if the dependency is not found.
 * @returns The resolved dependency or undefined if the dependency is not necessary
 * and not found, or throws an error if the dependency is necessary and not found.
 * @throws **Only throws errors if the dependency is necessary.**
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 * @throws A {@link InjectorError} if an error occurs during the injection process.
 * @throws A {@link NoInstantiationMethodError} if the dependency does not have a constructor.
 * @example
 * ```ts
 * class MyClass {
 *   \@Inject<MyDependency>('MyDependencyIdentifier')
 *   private myDependency!: MyDependency;
 * }
 * ```
 * @example
 * ```ts
 * class MyClass {
 *   \@Inject('ILogger_', (x: ILogger_) => x.getLogger('Tags'), false)
 *   private _logger?: ILogger;
 * }
 * ```
 */
export function Inject<T, U>(
    identifier: Identifier,
    init?: InitDelegate<T, U> | true,
    necessary = true,
) {
    return function (target: unknown, propertyKey: string | symbol): void {
        // Unique symbol to store the private property
        const privatePropertyKey: unique symbol = Symbol();
        // Get the DI container instance
        const diContainer = TSinjex.getInstance();

        // Function to evaluate the dependency lazily
        // to avoid circular dependencies, not found dependencies, etc.
        const evaluate = (): T | undefined => {
            return diContainer.resolve<T>(identifier, necessary);
        };

        // Define the property
        Object.defineProperty(target, propertyKey, {
            get() {
                // If the property is not defined, evaluate the dependency
                if (!this.hasOwnProperty(privatePropertyKey)) {
                    if (init != null) {
                        try {
                            const dependency = evaluate();

                            if (dependency != null) {
                                if (typeof init === 'function') {
                                    try {
                                        this[privatePropertyKey] =
                                            init(dependency);
                                    } catch (error) {
                                        if (necessary)
                                            throw new InitializationError(
                                                identifier,
                                                error,
                                            );
                                    }
                                } else if (
                                    init === true &&
                                    hasConstructor(dependency)
                                ) {
                                    this[privatePropertyKey] = new dependency();
                                } else
                                    throw new NoInstantiationMethodError(
                                        identifier,
                                    );
                            } else if (necessary) {
                                throw new DependencyResolutionError(identifier);
                            }
                        } catch (error) {
                            if (necessary) {
                                if (
                                    !(
                                        error instanceof
                                        NoInstantiationMethodError
                                    ) &&
                                    !(
                                        error instanceof
                                        DependencyResolutionError
                                    )
                                )
                                    throw new InjectorError(identifier, error);
                                else throw error;
                            }
                        }
                    } else {
                        this[privatePropertyKey] = evaluate();
                    }
                }

                /**
                 * Replace itself with the resolved dependency
                 * for performance reasons.
                 */
                Object.defineProperty(this, propertyKey, {
                    value: this[privatePropertyKey],
                    writable: false,
                    enumerable: false,
                    configurable: false,
                });

                return this[privatePropertyKey];
            },
            /**
             * Make the property configurable to allow replacing it
             */
            configurable: true,
        });
    };
}

/**
 * Checks if an object has a constructor.
 * @param obj The object to check.
 * @returns True if the object has a constructor, false otherwise.
 */
function hasConstructor<T>(obj: T): obj is T & { new (): unknown } {
    const _obj = obj as unknown as { prototype?: { constructor?: unknown } };

    return (
        _obj?.prototype != null &&
        typeof _obj.prototype.constructor === 'function'
    );
}
