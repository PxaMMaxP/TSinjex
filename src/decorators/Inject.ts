import { TSinjex } from '../classes/TSinjex';
import {
    DependencyResolutionError,
    IdentifierRequiredError,
    InitializationError,
    InjectorError,
    NoInstantiationMethodError,
} from '../interfaces/Exceptions';
import { Identifier } from '../types/Identifier';
import { InitDelegate } from '../types/InitDelegate';

/**
 * A decorator to inject a dependency from a DI (Dependency Injection) container into a class property.
 * @template TargetType The type of the class to inject the dependency into.
 * @template DependencyType The type of the dependency to be injected.
 * @template PropertyType The type of the property to be injected.
 * @param identifier The {@link Identifier|identifier} used to resolve the dependencie in the DI container or the property name if not provided.
 * @param init An optional initializer {@link InitDelegate|function} to transform the dependency before injection
 * or true to instantiate the dependency if it has a constructor.
 * @param necessary If true, throws an error if the dependency is not found.
 * @returns The resolved dependency or undefined if the dependency is not necessary
 * and not found, or throws an error if the dependency is necessary and not found.
 * @throws **Only throws errors if the dependency is necessary.**
 * @throws An {@link IdentifierRequiredError} if the identifier is not provided and the class name is not available.
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 * @throws A {@link InjectorError} if an error occurs during the injection process.
 * @throws A {@link NoInstantiationMethodError} if the dependency does not have a constructor.
 * @throws An {@link InitializationError} if an error occurs during the initialization process.
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
export function Inject<TargetType, DependencyType, PropertyType>(
    identifier?: Identifier,
    init?: InitDelegate<DependencyType, PropertyType> | true,
    necessary = true,
) {
    return function (
        constructor: undefined,
        context: ClassFieldDecoratorContext<TargetType>,
    ): (
        this: TargetType,
        initialValue: PropertyType | undefined,
    ) => PropertyType {
        const _identifier = identifier ?? context.name;

        if (_identifier == null && necessary === true)
            throw new IdentifierRequiredError();

        /**
         * Function to evaluate the dependency lazily
         * to avoid circular dependencies, not found dependencies, etc.
         * @returns The resolved dependency or undefined if the dependency is not found.
         */
        const resolve = (): DependencyType | undefined => {
            return TSinjex.getInstance().resolve<DependencyType>(
                _identifier,
                necessary,
            );
        };

        return function (
            this: TargetType,
            initialValue: PropertyType | undefined,
        ): PropertyType {
            let instance: DependencyType | PropertyType | undefined;

            const dependency: DependencyType | undefined = tryAndCatch(
                () => resolve(),
                necessary,
                _identifier,
                DependencyResolutionError,
            );

            if (dependency != null) {
                const initFunction: (() => PropertyType) | undefined =
                    typeof init === 'function' && dependency != null
                        ? (): PropertyType => init(dependency)
                        : init === true && hasConstructor(dependency)
                          ? (): PropertyType => new dependency() as PropertyType
                          : undefined;

                if (init == null) instance = dependency;
                else if (initFunction != null)
                    instance = tryAndCatch(
                        initFunction,
                        necessary,
                        _identifier,
                        InitializationError,
                    );
                else if (necessary)
                    throw new NoInstantiationMethodError(_identifier);
            } else if (necessary)
                throw new DependencyResolutionError(_identifier);

            /**
             * Replace itself with the resolved dependency
             * for performance reasons.
             */
            Object.defineProperty(this, context.name, {
                value: instance,
                writable: false,
                enumerable: false,
                configurable: false,
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return instance as any;
        };
    };
}

/**
 * Tries to execute a function and catches any errors that occur.
 * If the function is necessary and an error occurs, it throws the error
 * with the specified error class and identifier.
 * @param fn The function to execute.
 * @param necessary If true, throws an error if an error occurs.
 * @param identifier The identifier of the dependency.
 * @param errorClass The error class to throw if an error occurs.
 * @returns The result of the function or undefined if an error occurs and the function is not necessary.
 */
function tryAndCatch<ReturnType, ErrorType>(
    fn: () => ReturnType,
    necessary: boolean,
    identifier?: Identifier,
    errorClass?: ErrorType,
): ReturnType | undefined {
    try {
        return fn();
    } catch (error) {
        if (necessary)
            throw new (errorClass != null ? errorClass : error)(
                identifier ?? 'not specified',
                error,
            );
        else return undefined;
    }
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
