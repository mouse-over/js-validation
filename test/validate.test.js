import {
    getRuleOnPath,
    validateField, validateObject
} from "../src/validate";
import {updateValidationResult} from "../src/updateValidationResult";

const rules = {
    minTest: {
        required: {message: 'Please set!'},
        min: 5,
        minLength: 2
    }
};

test('validateField failed with minLength', () => {
    expect(
        validateField(9, rules, 'minTest')
    ).toStrictEqual({
        messages: [
            "Please enter at least 2 characters."
        ],
        valid: false
    });
});

test('validateField failed with minLength and min', () => {
    expect(
        validateField(3, rules, 'minTest')
    ).toStrictEqual({
        messages: [
            "Please enter value less than 5.",
            "Please enter at least 2 characters."
        ],
        valid: false
    });
});

test('validateField failed not set at all with custom rule message', () => {
    expect(
        validateField(undefined, rules, 'minTest')
    ).toStrictEqual({
        messages: [
            "Please set!",
            "Please enter value less than 5.",
            "Please enter at least 2 characters."
        ],
        valid: false
    });

    expect(
        validateField(null, rules, 'minTest')
    ).toStrictEqual({
        messages: [
            "Please set!",
            "Please enter value less than 5.",
            "Please enter at least 2 characters."
        ],
        valid: false
    });

    expect(
        validateField('', rules, 'minTest')
    ).toStrictEqual({
        messages: [
            "Please set!",
            "Please enter value less than 5.",
            "Please enter at least 2 characters."
        ],
        valid: false
    });
});

test('validateField passed', () => {
    expect(
        validateField(11, rules, 'minTest')
    ).toStrictEqual({
        messages: [],
        valid: true
    });
});

test('validate object', () => {
    const result = validateObject(
        {
            minTest: 12,
            noRules: 'foo'
        },
        rules
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

test('validate pattern', () => {
    const result = validateField(
        '12345',
        {
            zipCode: {
                required: false,
                minLength: 5,
                maxLength: 5,
                pattern: {
                    message: 'PSČ musí být číslo',
                    params: '([0-9]\s*){5}'
                }
            }
        },
        'zipCode'
    );

    expect(result).toStrictEqual({
        "messages": [],
        "valid": true
    });
});


test('validate empty not required', () => {
    const result = validateField(
        '',
        {
            test: {
                required: false
            }
        },
        'test'
    );

    expect(result).toStrictEqual({
        "messages": [],
        "valid": true
    });
});

test('validate nested objects with invalid values', () => {
    const result = validateObject(
        {
            contact: {},
            addressBook: {},
        },
        {
            contact: {
                children: {
                    contactFirstname: {
                        required: true
                    },
                    contactSurname: {
                        required: true
                    },
                    contactEmail: {
                        required: true,
                        email: true
                    }
                }
            },
            addressBook: {
                children: {
                    name: {
                        required: true
                    },
                    companyId: {
                        required: true
                    },
                    zipCode: {
                        required: false,
                        minLength: 5,
                        maxLength: 5,
                        pattern: {
                            message: 'PSČ musí být číslo',
                            params: '([0-9]\s*){5}'
                        }
                    }
                }
            }
        }
    );
    expect(result).toStrictEqual({
        "children": {
            "addressBook": {
                "children": {
                    "companyId": {
                        "messages": [
                            "This field is required"
                        ],
                        "valid": false
                    },
                    "name": {
                        "messages": [
                            "This field is required"
                        ],
                        "valid": false
                    },
                    "zipCode": {
                        "messages": [],
                        "valid": true
                    }
                },
                "messages": [],
                "valid": false
            },
            "contact": {
                "children": {
                    "contactEmail": {
                        "messages": [
                            "This field is required",
                            "Please provide valid email"
                        ],
                        "valid": false
                    },
                    "contactFirstname": {
                        "messages": [
                            "This field is required"
                        ],
                        "valid": false
                    },
                    "contactSurname": {
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
        "valid": false
    });
});

test('validate nested objects with invalid values', () => {
    const result = validateObject(
        {
            contact: {
                contactFirstname: 'John',
                contactSurname: 'Doe',
                contactEmail: 'john.doe@test.test'
            },
            addressBook: {
                name: 'company name',
                companyId: 'XXXXXXXXX',
                zipCode: '23421'
            },
        },
        {
            contact: {
                children: {
                    contactFirstname: {
                        required: true
                    },
                    contactSurname: {
                        required: true
                    },
                    contactEmail: {
                        required: true,
                        email: true
                    }
                }
            },
            addressBook: {
                children: {
                    name: {
                        required: true
                    },
                    companyId: {
                        required: true
                    },
                    zipCode: {
                        required: false,
                        minLength: 5,
                        maxLength: 5,
                        pattern: {
                            message: 'PSČ musí být číslo',
                            params: '([0-9]\s*){5}'
                        }
                    }
                }
            }
        }
    );
    expect(result).toStrictEqual({
        "children": {
            "addressBook": {
                "children": {
                    "companyId": {
                        "messages": [],
                        "valid": true
                    },
                    "name": {
                        "messages": [],
                        "valid": true
                    },
                    "zipCode": {
                        "messages": [],
                        "valid": true
                    }
                },
                "messages": [],
                "valid": true
            },
            "contact": {
                "children": {
                    "contactEmail": {
                        "messages": [],
                        "valid": true
                    },
                    "contactFirstname": {
                        "messages": [],
                        "valid": true
                    },
                    "contactSurname": {
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

test('update validation object by path', () => {
    const state = {
        "children": {
            "addressBook": {
                "children": {
                    "companyId": {
                        "messages": [],
                        "valid": true
                    },
                    "name": {
                        "messages": [],
                        "valid": true
                    },
                    "zipCode": {
                        "messages": [],
                        "valid": true
                    }
                },
                "messages": [],
                "valid": true
            }
        },
        "valid": true
    };

    const result = updateValidationResult(state, ['addressBook', 'name'], {valid: false, messages: ['wrong']});

    expect(result).toStrictEqual({
        "children": {
            "addressBook": {
                "children": {
                    "companyId": {
                        "messages": [],
                        "valid": true
                    },
                    "name": {
                        "messages": ['wrong'],
                        "valid": false
                    },
                    "zipCode": {
                        "messages": [],
                        "valid": true
                    }
                },
                "messages": [],
                "valid": false
            }
        },
        "valid": false
    });
});

test('getRuleOnPath', () => {
    const rules = {
        contact: {
            children: {
                contactFirstname: {
                    required: true
                },
                contactSurname: {
                    required: true
                },
                contactEmail: {
                    required: true,
                    email: true
                }
            }
        }
    };

    const rule = getRuleOnPath(rules, ['contact', 'contactFirstname']);
    expect(rule).toStrictEqual({
        required: true
    });
});


test('validateField callback provides rules', () => {

    const rulesWithCallback = {
        minTest: () => rules.minTest
    };

    expect(
        validateField(9, rulesWithCallback, 'minTest')
    ).toStrictEqual({
        messages: [
            "Please enter at least 2 characters."
        ],
        valid: false
    });
});

test('validateObject with callback provides rules', () => {
    const rulesWithCallback = {
        minTest: (results) => {
            console.log(results);
            return rules.minTest;
        }
    };

    const result = validateObject(
        {
            minTest: 12,
            noRules: 'foo'
        },
        rulesWithCallback
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