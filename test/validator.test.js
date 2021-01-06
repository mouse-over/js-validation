import {defaultRuleSet} from "../src/validate";
import {createValidator} from "../src";

const rules = {
    minTest: {
        required: {message: 'Please set!'},
        min: 5,
        minLength: 2
    }
};
test('create validator', () => {
    const validator = createValidator(defaultRuleSet)(rules);
    expect(validator.rules).toStrictEqual(rules);
    expect(validator.ruleSet).toStrictEqual(defaultRuleSet);
    expect(validator.validateObject).toBeInstanceOf(Function);
    expect(validator.validateObject).toBeInstanceOf(Function);
});

test('validator.validateField failed with minLength', () => {
    const validator = createValidator(defaultRuleSet)(rules);
    expect(
        validator.validateField(9, 'minTest')
    ).toStrictEqual({
        messages: [
            "Please enter at least 2 characters."
        ],
        valid: false
    });
});

test('validator.validateObject', () => {
    const validator = createValidator(defaultRuleSet)(rules);
    const result = validator.validateObject(
        {
            minTest: 12,
            noRules: 'foo'
        }
    );

    expect(result).toStrictEqual({
        "children": {
            "minTest": {
                "messages": [],
                "valid": true
            }
        },

        "valid": true
    });
});

test('validator.validateObjectField', () => {
    const validator = createValidator(defaultRuleSet)(rules);
    const result = validator.validateObjectField(
        {
            minTest: 12,
            noRules: 'foo'
        },
        'minTest'
    );

    expect(result).toStrictEqual({
        "messages": [],
        "valid": true
    });
});

test('validator.validateObject nested rules', () => {
    const validator = createValidator(defaultRuleSet)({
        nested: {
            children: {
                first: {
                    children: {
                        second: {
                            children: {
                                requiredValue: {
                                    required: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const result = validator.validateObject(
        {
            nested: {
                first: {
                    second: {}
                }
            }
        }
    );

    expect(result).toStrictEqual({
        "children": {
            "nested": {
                "children": {
                    "first": {
                        "children": {
                            "second": {
                                "children": {
                                    "requiredValue": {
                                        "messages": [
                                            "This field is required"
                                        ],
                                        "valid": false
                                    }
                                },
                                "messages": [],
                                "valid": false
                            }
                        },
                        "messages": [],
                        "valid": false
                    }
                },
                "messages": [],
                "valid": false
            }
        },
        "valid": false
    });
});

test('validator.validateObject with undefined values', () => {
    const validator = createValidator(defaultRuleSet)(rules);
    const result = validator.validateObject(undefined);

    expect(result).toStrictEqual({
        "children": {
            "minTest": {
                "messages": [
                    "Please set!",
                    "Please enter value greater than 5.",
                    "Please enter at least 2 characters."
                ],
                "valid": false
            }
        },
        "valid": false
    });
});

test('validator.validateObject with null values', () => {
    const validator = createValidator(defaultRuleSet)(rules);
    const result = validator.validateObject(undefined);

    expect(result).toStrictEqual({
        "children": {
            "minTest": {
                "messages": [
                    "Please set!",
                    "Please enter value greater than 5.",
                    "Please enter at least 2 characters."
                ],
                "valid": false
            }
        },
        "valid": false
    });
});

test('validator.validateObject with array', () => {
    const validator = createValidator(defaultRuleSet)({
        minTest: {
            items: rules.minTest,
            isArray: true
        }
    });
    const result = validator.validateObject(
        {
            minTest: [12]
        }
    );

    expect(result).toStrictEqual({
        "children": {
            "minTest": {
                "children": {
                    0: {
                        "messages": [],
                        "valid": true
                    }
                },
                "messages": [],
                "valid": true
            }
        },
        "valid": true
    });
});

test('validator.validateObject with array invalid', () => {
    const validator = createValidator(defaultRuleSet)({
        minTest: {
            items: rules.minTest,
            isArray: true
        }
    });
    const result = validator.validateObject(
        {
            minTest: [2]
        }
    );

    expect(result).toStrictEqual({
        "children": {
            "minTest": {
                "children": {
                    "0": {
                        "messages": [
                            "Please enter value greater than 5.",
                            "Please enter at least 2 characters."
                        ],
                        "valid": false
                    }
                },
                "messages": [],
                "valid": false
            }
        },
        "valid": false
    });
});
