import { ITSInjex_, ITSInjex } from '../interfaces/ITSInjex';

/**
 * Test the implementation of a DIContainer
 * @param Container The DIContainer implementation to test.
 * Must implement {@link ITSInjex}, {@link ITSInjex_}
 */
export function test_IDIContainer(Container: ITSInjex_): void {
    describe('IDIContainer Implementation Tests', () => {
        let container: ITSInjex;

        beforeEach(() => {
            container = Container.getInstance();
        });

        it('should register and resolve a dependency', () => {
            const identifier = 'myDependency';
            const dependency = { value: 42 };

            container.register(identifier, dependency);

            const resolvedDependency =
                container.resolve<typeof dependency>(identifier);
            expect(resolvedDependency).toBe(dependency);
        });

        it('should register and resolve a dependency static', () => {
            const identifier = 'myDependency';
            const dependency = { value: 42 };

            Container.register(identifier, dependency);

            const resolvedDependency =
                Container.resolve<typeof dependency>(identifier);
            expect(resolvedDependency).toBe(dependency);
        });

        it('should throw an error when resolving a non-registered dependency static', () => {
            const identifier = 'nonExistentDependency';

            expect(() => Container.resolve<unknown>(identifier)).toThrow();
        });

        // Add more tests as necessary
    });
}
