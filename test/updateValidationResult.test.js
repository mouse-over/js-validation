import {updateValidationResult} from "../src/updateValidationResult";

test('update validation result with simple key valid', () => {
    const current = {
        children: {
            foo: {valid: true}
        },
        messages: [],
        valid: true
    };

    const updated = updateValidationResult(current, 'foo', {valid: true});
    expect(updated).toStrictEqual(current);
});

test('update validation result with simple key invalid', () => {
    const current = {
        children: {
            foo: {valid: true}
        },
        messages: [],
        valid: true
    };

    const updated = updateValidationResult(current, 'foo', {valid: false, messages: ['ERROR']});

    expect(updated).toStrictEqual({
        children: {
            foo: {valid: false, messages: ['ERROR']}
        },
        messages: [],
        valid: false
    });
});

test('update validation result with nested key valid', () => {
    const current = {
        children: {
            foo: {
                children: {
                    bar: {valid: true}
                },
                valid: true
            }
        },
        messages: [],
        valid: true
    };

    const updated = updateValidationResult(current, ['foo','bar'], {valid: true});
    expect(updated).toStrictEqual(current);
});

test('update validation result with nested key invalid', () => {
    const current = {
        children: {
            foo: {
                children: {
                    bar: {valid: true}
                },
                valid: true
            }
        },
        messages: [],
        valid: true
    };

    const updated = updateValidationResult(current, ['foo','bar'], {valid: false, messages: ['ERROR']});

    expect(updated).toStrictEqual({
        children: {
            foo: {
                children: {
                    bar: {valid: false, messages: ['ERROR']}
                },
                valid: false
            }
        },
        messages: [],
        valid: false
    });
});