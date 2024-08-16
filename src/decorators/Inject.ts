import { TSinjex } from '../classes/TSinjex';
import { Identifier } from '../types/Identifier';
import { InitDelegate } from '../types/InitDelegate';

/**
 * A decorator to inject a dependency from a DI (Dependency Injection) container into a class property.
 * @template T The type of the dependency to be injected.
 * @template U The type of the property to be injected.
 * @param identifier The identifier used to resolve the class in the DI container.
 * @see {@link Identifier} for more information on identifiers.
 * @param init An optional initializer function to transform the dependency before injection.
 * @see {@link InitDelegate} for more information on initializer functions.
 * @param necessary If true, throws an error if the dependency is not found.
 * @returns The resolved dependency or undefined if the dependency is not necessary
 * and not found, or throws an error if the dependency is necessary and not found.
 * @throws A {@link DependencyResolutionError} if the dependency is not found and necessary.
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
    init?: InitDelegate<T, U>,
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
                    if (init) {
                        try {
                            this[privatePropertyKey] = init(evaluate() as T);
                        } catch (error) {
                            if (necessary) {
                                throw error;
                            }
                        }
                    } else {
                        this[privatePropertyKey] = evaluate();
                    }
                }

                return this[privatePropertyKey];
            },
            // Not necessary to set the property
            // set(value: PropertieType) {
            //     this[privatePropertyKey] = value;
            // },
            enumerable: true,
            configurable: false,
        });
    };
}
