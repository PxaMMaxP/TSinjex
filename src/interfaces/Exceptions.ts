import { ITSinjex } from './ITSinjex';

/**
 * General error class for {@link ITSinjex} interface.
 */
export class TSinjexError extends Error {
    /**
     * Creates a new instance of {@link TSinjexError}
     * @param message **The error message**
     */
    constructor(message: string) {
        super(message);
        this.name = 'TSinjex';
    }
}

/**
 * Error class for dependency resolution errors in {@link ITSinjex}.
 * @see {@link ITSinjex.resolve}
 */
export class DependencyResolutionError extends TSinjexError {
    /**
     * Creates a new instance of {@link DependencyResolutionError}
     * @param identifier **The identifier of the dependency**
     */
    constructor(identifier: string) {
        super(`Dependency ${identifier} could not be resolved.`);
        this.name = 'TSinjexResolutionError';
    }
}
