import { ITSInjex } from './IDIContainer';

/**
 * General error class for {@link ITSInjex} interface.
 */
export class TSInjexError extends Error {
    /**
     * Creates a new instance of {@link TSInjexError}
     * @param message **The error message**
     */
    constructor(message: string) {
        super(message);
        this.name = 'TSInjex';
    }
}

/**
 * Error class for dependency resolution errors in {@link ITSInjex}.
 * @see {@link ITSInjex.resolve}
 */
export class DependencyResolutionError extends TSInjexError {
    /**
     * Creates a new instance of {@link DependencyResolutionError}
     * @param identifier **The identifier of the dependency**
     */
    constructor(identifier: string) {
        super(`Dependency ${identifier} not found.`);
        this.name = 'TSInjexResolutionError';
    }
}
