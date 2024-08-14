import { ImplementsStatic } from './helper/ImplementsStatic';
import { IDependency } from './interfaces/IDependency';
import { ITSinjex, ITSinjex_ } from './interfaces/ITSinjex';

/**
 * **TSInjex**: Dependency Injection Container
 */
@ImplementsStatic<ITSinjex_>()
export class TSinjex implements ITSinjex {
    private static _instance: TSinjex;
    private readonly _dependencies = new Map<string, IDependency>();

    /**
     * Private constructor to prevent direct instantiation.
     */
    private constructor() {}

    //#region IDIContainer_

    /**
     * Retrieves the singleton instance of DependencyRegistry.
     * @returns The singleton instance.
     */
    public static getInstance(): ITSinjex {
        if (this._instance == null) {
            this._instance = new TSinjex();
        }

        return this._instance;
    }

    /**
     * @inheritdoc
     * @see {@link ITSInjexRegister.register}
     */
    public static register<T>(
        identifier: string,
        dependency: T,
        deprecated = false,
    ): void {
        (TSinjex.getInstance() as TSinjex)._dependencies.set(identifier, {
            dependency: dependency,
            deprecated: deprecated,
        });
    }

    /**
     * @inheritdoc
     * @see {@link ITSInjexResolve.resolve}
     */
    public static resolve<T>(
        identifier: string,
        necessary = true,
    ): T | undefined {
        return (TSinjex.getInstance() as TSinjex).resolve<T>(
            identifier,
            necessary,
        );
    }

    //#endregion

    //#region IDIContainer

    /**
     * @inheritdoc
     */
    public register<T>(
        identifier: string,
        dependency: T,
        deprecated = false,
    ): void {
        this._dependencies.set(identifier, {
            dependency: dependency,
            deprecated: deprecated,
        });
    }

    /**
     * @inheritdoc
     */
    public resolve<T>(identifier: string, necessary = true): T | undefined {
        const dependency = this._dependencies.get(identifier);

        if (necessary && !dependency) {
            throw new Error(`Dependency ${identifier} not found`);
        } else if (!dependency) {
            return undefined;
        }

        if (dependency.deprecated) {
            // eslint-disable-next-line no-console
            console.warn(`Dependency ${identifier} is deprecated`);

            // Remove the deprecation warning; it should only be logged once.
            dependency.deprecated = false;
        }

        return dependency.dependency as T;
    }

    //#endregion
}
