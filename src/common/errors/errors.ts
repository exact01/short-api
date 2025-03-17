export const ERRORS = {
    // ... existing code ...
    BALANCE_NOT_FOUND: {
        code: 'BALANCE_NOT_FOUND',
        message: 'Balance not found',
    },
    BALANCE_ALREADY_EXISTS: {
        code: 'BALANCE_ALREADY_EXISTS',
        message: 'Balance already exists for this user',
    },
    INSUFFICIENT_BALANCE: {
        code: 'INSUFFICIENT_BALANCE',
        message: 'Insufficient balance for this operation',
    },
    // ... existing code ...
} as const;
