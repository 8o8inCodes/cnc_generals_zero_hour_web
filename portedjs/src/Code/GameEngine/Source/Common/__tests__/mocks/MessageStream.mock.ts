import { vi } from 'vitest';

const MessageStreamMock = vi.fn(() => ({
    init: vi.fn(),
    reset: vi.fn(),
    update: vi.fn(),
    appendMessage: vi.fn().mockReturnValue({
        type: 0,
        args: [],
        appendIntegerArgument: vi.fn(),
        appendStringArgument: vi.fn()
    }),
    propagateMessages: vi.fn()
}));

export default MessageStreamMock;