/**
 * Interface for modules that need to handle object creation/build completion
 */
export interface CreateModuleInterface {
    shouldDoOnBuildComplete(): boolean;
    onBuildComplete(): void;
    onCreate(): void;
}