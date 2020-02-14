import objectAssignDeep from "object-assign-deep";

/**
 * util for updating state object
 *
 * A note on useBuiltin. By default, we will use objectAssignDeep, which won't
 * flat out repace nested objects, it will merge them. this is normally good.
 * but if you want to replace an entire key with {}, you need to use Object.assign
 * which simply swaps the pointer to a new object, not retaining the old data.
 */
export const update = (state, newData, useBuiltin=false) => {
  if (useBuiltin) {
    const newStateBuiltin = Object.assign({}, state, newData);
    return newStateBuiltin;
  }
  const newState = objectAssignDeep({}, state, newData);
  return newState;
};

// creates a slicer for a given exclude array (key names)
export const slicer = (exclude) => {
  return (state) => {
    if (!state) return state;
    const newState = {};
    for(let key in state) {
      if (!state.hasOwnProperty(key)) continue;
      if (exclude.indexOf(key) >= 0) continue;
      newState[key] = state[key];
    }
    return newState;
  }
};
