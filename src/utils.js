/**
 * Inspired by knockout validation https://github.com/Knockout-Contrib/Knockout-Validation.git
 * License: MIT
 */


export const isEmpty = (val) => {
    if (val === undefined || val === null) {
        return true;
    }

    if (typeof (val) === 'string') {
        let testVal = val;
        if (String.prototype.trim) {
            testVal = val.trim();
        } else {
            testVal = val.replace(/^\s+|\s+$/g, '');
        }

        return (testVal + '').length === 0;
    }

    return false;
};

export const isValidPattern = (value, regex) => {
    return value.toString().match(regex) !== null;
};

export const isEmail = (value) => {
    // jquery validate regex
    return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value));
};

export const isObject = (value) => value !== null && typeof value === 'object';

export const isNumber = (value) => !isEmpty(value) && !isNaN(value);

export const normalizeToString = (value) => {
    if (isNumber(value)) {
        return '' + value;
    }

    if (isEmpty(value)) {
        return '';
    }

    return value;
};

export const isValidMinLength = (value, minLength) => {
    return normalizeToString(value).length >= minLength;
};

export const isValidMaxLength = (value, maxLength) => {
    return normalizeToString(value).length <= maxLength;
};

export const isValidMin = (value, min) => {
    return parseFloat(value) >= parseFloat(min);
};

export const isValidMax = (value, max) => {
    return parseFloat(value) <= parseFloat(max);
};

export const isRequired =(value, required) => {
    if (isEmpty(value)) {
        return !required;
    }

    return true;
};