import { DependencyResolutionError } from '../interfaces/Exceptions';
import { TSInjex } from '../TSInjex';

/**
 * Resolve a dependency.
 * @param identifier The identifier of the dependency.
 * @returns The resolved dependency.
 * @throws A {@link DependencyResolutionError} if the dependency is not found.
 */
export function resolve<T>(identifier: string): T;

/**
 * Resolve a dependency
 * @param identifier The identifier of the dependency.
 * @param necessary The dependency is **not** necessary.
 * @returns The resolved dependency or undefined if the dependency is not found.
 */
export function resolve<T>(identifier: string, necessary: false): T | undefined;

/**
 * Resolve a dependency.
 * @param identifier The identifier of the dependency.
 * @param necessary If true, throws an error if the dependency is not found.
 * @returns The resolved dependency or undefined if the dependency is not necessary
 * and not found, or throws an error if the dependency is necessary and not found.
 * @throws A {@link DependencyResolutionError} if the dependency is not found and necessary.
 */
export function resolve<T>(
    identifier: string,
    necessary?: boolean,
): T | undefined {
    return TSInjex.getInstance().resolve<T>(identifier, necessary);
}
