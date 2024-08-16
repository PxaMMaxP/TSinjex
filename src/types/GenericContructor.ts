/**
 * Generic constructor type.
 * This type is used to define a constructor of a class.
 */
export type GenericConstructor<
    T extends abstract new (...args: unknown[]) => InstanceType<T>,
> = new (...args: ConstructorParameters<T>) => T;

/**
 * Force generic constructor type.
 * This type is used to force a class to has a constructor.
 */
export type ForceConstructor<T> = new (...args: unknown[]) => T;
