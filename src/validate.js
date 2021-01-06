import {
    isEmail,
    isEmpty,
    isObject,
    isRequired,
    isValidMax,
    isValidMaxLength,
    isValidMin,
    isValidMinLength,
    isValidPattern,
    getValue
} from "@mouseover/js-utils";


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
        message: 'Please enter value greater than {0}.'
    },
    max: {
        validate: isValidMax,
        message: 'Please enter value less than {0}.'
    },
    email: {
        validate: isEmail,
        message: 'Please provide valid email'
    },
    pattern: {
        validate: isValidPattern,
        message: 'Please provide valid value'
    },
    isArray: {
        validate: (value, must) => must && Array.isArray(value),
        message: 'Please enter valid value.'
    },
    typeOf: {
        validate: (value, type) => typeof  value === type,
        message: 'Please enter value of type {0}.'
    }
};

/**
 * Validate single field rule using given params
 *
 * @param value
 * @param rule
 * @param params
 * @returns {*|void|string|boolean}
 */
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
 * @param fieldRules
 * @returns {boolean|*}
 */
const isRequiredByRules = (fieldRules) => {
    if (!fieldRules.hasOwnProperty('required')) {
        return false; // not defined, not required
    }

    if (isObject(fieldRules.required)) {
        if (fieldRules.required.hasOwnProperty('required')) {
            return fieldRules.required.params;
        }

        return true;
    }

    return fieldRules.required;
};

/**
 * Validate given value with given rules using ruleSet
 *
 * @param value
 * @param fieldRules
 * @param ruleSet
 * @returns {{valid: boolean, messages: unknown}|{valid: boolean, messages: []}}
 */
const validateFieldRules = (value, fieldRules, ruleSet = defaultRuleSet) => {
    fieldRules = fieldRules || {};

    if (isEmpty(value) && !isRequiredByRules(fieldRules)) {
        return {valid: true, messages: []}; // is empty and not required, nothing to do...
    }

    if (typeof fieldRules === 'function') {
        fieldRules = fieldRules();
    }

    const {items, children, ...rules} = fieldRules;

    const result = Object.entries(rules).reduce((result, [key, params]) => {
        const [rule, ruleParams] = determineRule(ruleSet, key, params);
        if (rule) {
            result[key] = rule ? validateFieldRule(value, rule, ruleParams) : true;
        }
        return result;
    }, {});

    const fieldValidationSummary = createFieldValidationSummary(result);

    if (items) {
        const itemsResult = validateArray(value, items, ruleSet);
        fieldValidationSummary.children = itemsResult.children;
        fieldValidationSummary.valid = fieldValidationSummary.valid && itemsResult.valid;
    }

    if (children) {
        const childrenResult = validateObject(value, children, ruleSet);
        fieldValidationSummary.children = childrenResult.children;
        fieldValidationSummary.valid = fieldValidationSummary.valid && childrenResult.valid;
    }

    return fieldValidationSummary;
};

/**
 * Validate array of values with given rules using ruleSet
 * @param arrayItems
 * @param fieldRules
 * @param ruleSet
 * @returns {{result: *, valid: boolean}}
 */
const validateArray = (arrayItems, fieldRules, ruleSet) => {
    return arrayItems.reduce((current, item, index) => {
        current.children[index] = validateFieldRules(item, fieldRules, ruleSet);
        current.valid = current.valid && current.children[index].valid;
        return current;
    }, {children: {}, valid: true});
}

/**
 * Summarize validation result
 *
 * @param result
 * @returns {{valid: boolean, messages: unknown}}
 */
const createFieldValidationSummary = (result) => {
    const valid = isAllResultsValid(result);
    return {
        valid,
        messages: valid ? [] : resultMessages(result)
    };
}

const isAllResultsValid = (result) => {
    return Object.values(result).every((current) => current === true);
}

const resultMessages = (result) => {
    return Object.values(result).filter((current) => current !== true);
}

/**
 * Return's rule for given params
 *
 * @param ruleSet
 * @param ruleName
 * @param params
 *
 * @returns {[{validate}|{message}|*, null]|[*, *]|[null, null]} Rule and it's params if provided
 */
const determineRule = (ruleSet, ruleName, params) => {
    if (ruleSet.hasOwnProperty(ruleName)) {
       return [ruleSet[ruleName], params]
    } else if (isObject(params) && params.hasOwnProperty('message') && params.hasOwnProperty('validate')) {
        return [params, null];
    }
    return [null, null];
}


/**
 * Return's field rules on given name/path
 *
 * @param fieldsRules
 * @param name
 * @returns {*|null}
 */
export const getRulesOnPath = (fieldsRules, name) => {
    if (Array.isArray(name)) {
        const path = [...name];
        const current = path.shift();

        if (path.length === 0) {
            name = current;
        } else {
            return getRulesOnPath(fieldsRules[current] && fieldsRules[current].children ? fieldsRules[current].children : {}, path);
        }
    }

    return fieldsRules[name] || null;
};

/**
 * Validate value with rules in fieldsRules if any
 *
 * @param value
 * @param fieldsRules
 * @param name
 * @param ruleSet
 * @returns {{valid: boolean, messages: unknown}|{valid: boolean, messages: *[]}|{valid: boolean, messages: []}}
 */
export const validateField = (value, fieldsRules, name, ruleSet = defaultRuleSet) => {
    if (!fieldsRules) {
        return {valid: true, messages: []};
    }

    return validateFieldRules(
        value,
        getRulesOnPath(fieldsRules, name),
        ruleSet);
};

/**
 * Validate given object against given fields rules
 * @param object
 * @param fieldsRules
 * @param ruleSet
 * @returns {{valid: boolean, children: {}}}
 */
export const validateObject = (object, fieldsRules, ruleSet = defaultRuleSet) => {
    const result = Object.entries(fieldsRules).reduce((result, [key,rules]) => {
        const value = object ? object[key] : undefined;
        const fieldRules = prepareRules(rules, object);
        result[key] = validateFieldRules(value, fieldRules, ruleSet);
        return result;
    }, {});

    return {
        children: result,
        valid: Object.values(result).every((current) => current && current.valid === true)
    }
};

/**
 * Validate single object field against rules in given fields rules.
 * Difference between this function and validateField is that this validation
 * has whole object context (same as when validation whole object with validateObject)
 *
 * @param object
 * @param name
 * @param fieldsRules
 * @param ruleSet
 * @returns {{valid: boolean, messages: unknown}|{valid: boolean, messages: *[]}|{valid: boolean, messages: []}}
 */
export const validateObjectField = (object, name, fieldsRules, ruleSet = defaultRuleSet) => {
    if (!fieldsRules) {
        return {valid: true, messages: []};
    }
    const fieldRules = getRulesOnPath(fieldsRules, name);
    return validateFieldRules(
        getValue(object, name),
        prepareRules(fieldRules, object),
        ruleSet
    );
};

/**
 * Prepare filed Rules
 *
 * @param fieldRules
 * @param values
 * @returns {*}
 */
const prepareRules = (fieldRules, values) => {
    if (typeof fieldRules === 'function') {
        fieldRules = fieldRules(values);
    }
    return fieldRules;
};

export default validateField;

