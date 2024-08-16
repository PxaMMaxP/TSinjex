/* istanbul ignore file */

/**
 * Decorator to enforce static implementation of an interface.
 * Warns on compile time if the interface is not implemented.
 * @returns A decorator function
 */
export function ImplementsStatic<I>() {
    return <T extends I>(constructor: T, ...args: unknown[]) => {};
}
