import { DIContainer } from 'src/DIContainer';

/**
 * Register a dependency.
 * @param identifier The identifier of the dependency.
 * @param dependency The dependency to register.
 */
export function Register<T>(identifier: string, dependency: T): void;

/**
 * Register a dependency.
 * @param identifier The identifier of the dependency.
 * @param dependency The dependency to register.
 * @param deprecated A warning is logged when the dependency is resolved.
 */
export function Register<T>(
    identifier: string,
    dependency: T,
    deprecated?: true,
): void;

/**
 * Register a dependency.
 * @param identifier The identifier of the dependency.
 * @param dependency The dependency to register.
 * @param deprecated If true, the dependency is deprecated => a warning
 * is logged when the dependency is resolved.
 */
export function Register<T>(
    identifier: string,
    dependency: T,
    deprecated?: boolean,
): void {
    DIContainer.getInstance().register(identifier, dependency, deprecated);
}
