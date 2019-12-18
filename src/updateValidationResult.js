const updateChildren = (state, name, values) => {
    const newState = {
        ...state,
        children: {
            ...state.children,
            [name]: values
        }
    };

    newState.valid = Object.values(newState.children).every((current) => current.valid === true);

    return newState;
};

/**
 * Updates validation results
 *
 * @param state
 * @param name
 * @param validation
 * @returns {{children}}
 */
export const updateValidationResult = (state, name, validation) => {
    if (Array.isArray(name)) {
        const path = [...name];
        const current = path.shift();

        if (path.length === 0) {
            return updateChildren(state, current, validation);
        } else {
            const currentState = state.children && state.children[current] ? state.children[current] : {};
            return updateChildren(
                state,
                current,
                updateValidationResult(currentState, path, validation)
            );
        }
    } else {
        return updateChildren(state, name, validation);
    }
};