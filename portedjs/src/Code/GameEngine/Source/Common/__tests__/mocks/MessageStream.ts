import { MessageStream } from '../../interfaces/MessageStream';

export class MockMessageStream implements MessageStream {
    init(): void {}
    reset(): void {}
    update(): void {}
    appendMessage(): any {
        return {};
    }
    propagateMessages(): void {}
}