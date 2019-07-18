import {
    isEmail, isEmpty,
    isNumber,
    isObject,
    isValidMax,
    isValidMaxLength,
    isValidMin,
    isValidMinLength,
    isValidPattern,
    normalizeToString
} from "../src/utils";

test('empty string is empty', () => {
    expect(isEmpty('')).toBeTruthy();
});

test('whitespace string is empty', () => {
    expect(isEmpty('    ')).toBeTruthy();
});

test('undefined is empty', () => {
    expect(isEmpty(undefined)).toBeTruthy();
});

test('null is empty', () => {
    expect(isEmpty(null)).toBeTruthy();
});

test('0 is not empty', () => {
    expect(isEmpty(null)).toBeTruthy();
});

test('some string is not empty', () => {
    expect(isEmpty('  x ')).not.toBeTruthy();
});

test('number is not empty', () => {
    expect(isEmpty(23)).not.toBeTruthy();
});

test('is valid email', () => {
    expect(isEmail('boo@boo.boo')).toBeTruthy();
});

test('empty is not valid email', () => {
    expect(isEmail('')).not.toBeTruthy();
    expect(isEmail(null)).not.toBeTruthy();
    expect(isEmail(undefined)).not.toBeTruthy();
    expect(isEmail('   ')).not.toBeTruthy();
});

test('boo.boo is invalid email', () => {
    expect(isEmail('boo.boo')).not.toBeTruthy();
});

test('boo@boo is invalid email', () => {
    expect(isEmail('boo@boo')).not.toBeTruthy();
});

test('boo is invalid email', () => {
    expect(isEmail('boo')).not.toBeTruthy();
});

test('is valid pattern', () => {
    expect(isValidPattern('boo', 'boo')).toBeTruthy();
});

test('is invalid pattern', () => {
    expect(isValidPattern('foo', 'boo')).not.toBeTruthy();
});
test('{} is object', () => {
    expect(isObject({})).toBeTruthy();
});

test('() => {} is object', () => {
    expect(isObject(() => {
    })).not.toBeTruthy();
});

test('undefined is not object', () => {
    expect(isObject(undefined)).not.toBeTruthy();
});

test('null is not object', () => {
    expect(isObject(null)).not.toBeTruthy();
});

test('function is not  object', () => {
    const func = function () {
    };
    expect(isObject(func)).not.toBeTruthy();
});

test('1 is number', () => {
    expect(isNumber(1)).toBeTruthy();
});

test('0 is number', () => {
    expect(isNumber(0)).toBeTruthy();
});

test('string is not number', () => {
    expect(isNumber('s')).not.toBeTruthy();
});

test('empty string is not number', () => {
    expect(isNumber('')).not.toBeTruthy();
});

test('null is not number', () => {
    expect(isNumber(null)).not.toBeTruthy();
});

test('undefined is not number', () => {
    expect(isNumber(undefined)).not.toBeTruthy();
});

test('number normalizeToString', () => {
    expect(normalizeToString(1)).toBe('1');
});

test('null normalizeToString', () => {
    expect(normalizeToString(null)).toBe('');
});

test('undefined normalizeToString', () => {
    expect(normalizeToString(undefined)).toBe('');
});

test('is valid min length 1', () => {
    expect(isValidMinLength(1, 1)).toBeTruthy();
    expect(isValidMinLength('s', 1)).toBeTruthy();
});

test('null is not valid min length 1', () => {
    expect(isValidMinLength(null, 1)).not.toBeTruthy();
});

test('is valid min length 1', () => {
    expect(isValidMinLength(12, 1)).toBeTruthy();
    expect(isValidMinLength('foo', 1)).toBeTruthy();
});

test('is valid max length 1', () => {
    expect(isValidMaxLength(1, 1)).toBeTruthy();
    expect(isValidMaxLength('s', 1)).toBeTruthy();
});

test('null is valid max length 1', () => {
    expect(isValidMaxLength(null, 1)).toBeTruthy();
});

test('is not valid max length 1', () => {
    expect(isValidMaxLength(12, 1)).not.toBeTruthy();
    expect(isValidMaxLength('foo', 1)).not.toBeTruthy();
});

test('isValidMin pass', () => {
    expect(isValidMin(2, 1)).toBeTruthy();
    expect(isValidMin(1, 1)).toBeTruthy();
});

test('isValidMin fail', () => {
    expect(isValidMin(2, 3)).not.toBeTruthy();
    expect(isValidMin(-101, -100)).not.toBeTruthy();
});

test('isValidMax pass', () => {
    expect(isValidMax(1, 2)).toBeTruthy();
    expect(isValidMax(2, 2)).toBeTruthy();
});

test('isValidMax fail', () => {
    expect(isValidMax(3, 2)).not.toBeTruthy();
    expect(isValidMax(-100, -101)).not.toBeTruthy();
});
