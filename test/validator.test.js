import {defaultRuleSet} from "../src/validate";
import {createValidator} from "../src/validator";

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