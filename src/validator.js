import {validateObject, validateField, validateObjectField} from "./validate";

export const validator = (ruleSet, rules) => {
    return {
        ruleSet,
        rules,
        validateObject: (object) => validateObject(object, rules, ruleSet),
        validateObjectField: (object, name) => validateObjectField(object, name, rules, ruleSet),
        validateField: (value, name) => validateField(value, rules, name, ruleSet)
    }
};

export const createValidator = (ruleSet) => (rules) => validator(ruleSet, rules);