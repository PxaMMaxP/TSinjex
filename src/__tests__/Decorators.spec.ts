/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject } from 'src/decorators/Inject';
import { DependencyResolutionError } from 'src/interfaces/Exceptions';
import { ForceConstructor } from 'src/types/GenericContructor';
import { ITSinjex_, ITSinjex } from '../interfaces/ITSinjex';

/**
 * Test the Inject decorator.
 * @param Container The implementation to test.
 * @param inject The Inject decorator to test.
 */
export function test_InjectDecorator(
    Container: ITSinjex_,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    inject: Function,
): void {
    describe('Inject Decorator Tests', () => {
        let container: ITSinjex;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_instance'] = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_dependencies'] = undefined;
            container = Container.getInstance();
        });

        it('should inject dependency when necessary is true', () => {
            container.register('MockDependencyIdentifier', {
                value: 'test-value',
            });

            class TestClass {
                @Inject('MockDependencyIdentifier')
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }
            }

            const instance = new TestClass();
            expect(instance.getDependency().value).toBe('test-value');
        });

        it('should inject dependency and run initializer', () => {
            container.register('MockDependencyIdentifier', {
                value: 'test-value',
            });

            class TestClass {
                @Inject('MockDependencyIdentifier', (x: string) => {
                    (x as unknown as { value: string }).value =
                        'test-value-init';

                    return x;
                })
                dependency!: any;

                public getDependency() {
                    return this.dependency;
                }
            }

            const instance = new TestClass();
            expect(instance.getDependency().value).toBe('test-value-init');
        });

        it('should throw an error when necessary is true and the initializer throws an error', () => {
            let _error: Error | undefined = undefined;

            container.register('InitThrowDependencie', {
                value: 'test-value',
            });

            try {
                class TestClass {
                    @Inject(
                        'InitThrowDependencie',
                        () => {
                            throw new Error('Initializer error');
                        },
                        true,
                    )
                    dependency!: any;

                    public getDependency() {
                        return this.dependency;
                    }
                }

                const _instance = new TestClass();
                console.log(_instance.getDependency());
            } catch (error) {
                _error = error;
            }
            expect(_error).toBeInstanceOf(Error);
        });

        it('should throw an error when necessary is true and dependency is not found', () => {
            let _error: Error | undefined = undefined;

            try {
                class TestClass {
                    @Inject('NonExistentDependencyIdentifier')
                    private readonly _dependency!: any;

                    public getDependency() {
                        return this._dependency;
                    }
                }

                const _instance = new TestClass();
                console.log(_instance.getDependency());
            } catch (error) {
                _error = error;
            }
            expect(_error).toBeInstanceOf(DependencyResolutionError);
        });
    });
}

export function test_RegisterDecorator(
    Container: ITSinjex_,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    register: Function,
): void {
    describe('Register Decorator Tests', () => {
        let container: ITSinjex;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_instance'] = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_dependencies'] = undefined;
            container = Container.getInstance();
        });

        it('should register a dependency', () => {
            @register('MockDependencyIdentifier')
            class TestClass {
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }
            }

            expect(container.resolve('MockDependencyIdentifier')).toBe(
                TestClass,
            );
        });
    });
}

export function test_RegisterInstanceDecorator(
    Container: ITSinjex_,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    registerInstance: Function,
): void {
    describe('RegisterInstance Decorator Tests', () => {
        let container: ITSinjex;

        beforeEach(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_instance'] = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (Container as any)['_dependencies'] = undefined;
            container = Container.getInstance();
        });

        it('should register an instance of a dependency', () => {
            @registerInstance('InstanceIdentifier')
            class TestClass {
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }

                public mark: string = 'instance';
            }

            expect(
                container.resolve<TestClass>('InstanceIdentifier').mark,
            ).toBe('instance');
        });

        it('should register an instance of a dependency an run the init function', () => {
            @registerInstance(
                'InstanceIdentifier',
                (x: ForceConstructor<TestClass>) => {
                    const instance = new x();
                    instance.mark = 'init';

                    return instance;
                },
            )
            class TestClass {
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }

                public mark: string = 'instance';
            }

            expect(
                container.resolve<TestClass>('InstanceIdentifier').mark,
            ).toBe('init');
        });

        it('should register an instance of a dependency and get it on set', () => {
            @registerInstance('InstanceIdentifier')
            class TestClass {
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }

                public mark: string = 'instance';
                public test: string = 'test';
            }

            container.resolve<TestClass>('InstanceIdentifier').test = 'test2';

            expect(
                container.resolve<TestClass>('InstanceIdentifier').test,
            ).toBe('test2');
        });

        it('should register an instance of a dependency an run the init function on set', () => {
            @registerInstance(
                'InstanceIdentifier',
                (x: ForceConstructor<TestClass>) => {
                    const instance = new x();
                    instance.mark = 'init';

                    return instance;
                },
            )
            class TestClass {
                private readonly _dependency!: any;

                public getDependency() {
                    return this._dependency;
                }

                public mark: string = 'instance';
                public test: string = 'test';
            }

            container.resolve<TestClass>('InstanceIdentifier').test = 'test2';

            expect(
                container.resolve<TestClass>('InstanceIdentifier').test,
            ).toBe('test2');
        });
    });
}
