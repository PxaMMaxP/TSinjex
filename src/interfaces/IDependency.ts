/**
 * Dependency Entry Interface
 */
export interface IDependency {
    /**
     * The dependency itself
     */
    dependency: unknown;
    /**
     * If true, the dependency is deprecated => a warning
     * is logged when the dependency is resolved
     */
    deprecated?: boolean;
}
