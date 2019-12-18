import {isEmail, isEmpty, isObject, isRequired, isValidMax, isValidMaxLength, isValidMin, isValidMinLength, isValidPattern} from "@mouseover/js-utils";

/**
 * Format message by replacing each indexed placeholder '{index}' with appropriate value from replacements
 *
 * If replacement is not array, then it's used as value on 0 position
 *
 * @param {string} message
 * @param {array|object|any} replacements
 * @returns {*|void|string}
 */
const formatMessage = (message, replacements = []) => {
    if (!Array.isArray(replacements)) {
        replacements = [replacements];
    }
    return message.replace(/{(\d+)}/gi, function (match, index) {
        if (typeof replacements[index] !== 'undefined') {
            return replacements[index];
        }
        return match;
    });
};

/**
 * Creates validation message
 *
 * Message can by function for customizing message
 * Message can contain placeholders
 *
 * @param {string|function} message
 * @param {array|object|any} params
 * @param value
 *
 * @returns {*|void|string}
 */
export const createMessage = (message, params, value) => {
    if (isObject(params)) {
        params = params.value;
    }
    if (typeof message === 'function') {
        return message(params, value);
    }
    return formatMessage(message, params);
};

export const defaultRuleSet = {
    required: {
        validate: isRequired,
        message: 'This field is required'
    },
    minLength: {
        validate: isValidMinLength,
        message: 'Please enter at least {0} characters.'
    },
    maxLength: {
        validate: isValidMaxLength,
        message: 'Please enter no more than {0} characters.'
    },
    min: {
        validate: isValidMin,
        message: 'Please enter value less than {0}.'
    },
    max: {
        validate: isValidMax,
        message: 'Please enter value greater than {0}.'
    },
    email: {
        validate: isEmail,
        message: 'Please provide valid email'
    },
    pattern: {
        validate: isValidPattern,
        message: 'Please provide valid value'
    }
};

const validateFieldRule = (value, rule, params) => {
    let context;
    if (isObject(params)) {
        context = params;
    } else {
        context = {params};
    }

    const valid = rule.validate(value, context.params === undefined ? true : context.params);

    if (!valid) {
        return createMessage(context.message || rule.message, context.params, value);
    }

    return true;
};

/**
 * Check if field rules contains required rule. If so return true
 *
 * @param rules
 * @returns {boolean|*}
 */
const isRequiredByRules = (rules) => {
    if (!rules.hasOwnProperty('required')) {
        return false; // not defined, not required
    }

    if (isObject(rules.required)) {
        if (rules.required.hasOwnProperty('required')) {
            return rules.required.params;
        }

        return true;
    }

    return rules.required;
};

const validateFieldRules = (value, rules, ruleSet = defaultRuleSet) => {
    rules = rules || {};

    if (isEmpty(value) && !isRequiredByRules(rules)) {
        return {valid: true, messages: []}; // is empty and not required, nothing to do...
    }

    if (typeof rules === 'function') {
        rules = rules(value);
    }

    const result = Object.entries(rules).reduce((result, [key, params]) => {
        if (ruleSet.hasOwnProperty(key)) {
            result[key] = validateFieldRule(value, ruleSet[key], params);
        } else {
            result[key] = true;
        }
        return result;
    }, {});

    return {
        valid: Object.values(result).every((current) => current === true),
        messages: Object.values(result).reduce((messages, current) => {
            if (current !== true) {
                messages.push(current);
            }
            return messages;
        }, [])
    };
};

export const getRuleOnPath = (rules, name) => {
    if (Array.isArray(name)) {
        const path = [...name];
        const current = path.shift();

        if (path.length === 0) {
            name = current;
        } else {
            return getRuleOnPath(rules[current] && rules[current].children ? rules[current].children : {}, path);
        }
    }

    return rules[name] || null;
};

export const validateField = (value, rules, name, ruleSet = defaultRuleSet) => {
    if (!rules) {
        return {valid: true, messages: []};
    }
    const rule = getRuleOnPath(rules, name);
    return validateFieldRules(value, rule, ruleSet);
};

export const validateObject = (object, rules, ruleSet = defaultRuleSet) => {
    const result = Object.entries(rules).reduce((result, [key, rule]) => {
        const value = object[key];
        result[key] = validateFieldRules(value, rule, ruleSet);
        if (isObject(rule) && rule.hasOwnProperty('children')) {
            const childrenResult = validateObject(value, rule.children, ruleSet);
            result[key].children = childrenResult.children;
            if (!childrenResult.valid) {
                result[key].valid = false;
            }
        }
        return result;
    }, {});

    return {
        children: result,
        valid: Object.values(result).every((current) => current && current.valid === true)
    }
};

export default validateField;

