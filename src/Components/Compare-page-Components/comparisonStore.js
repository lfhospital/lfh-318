const listeners = new Set();

let removedIds = [];

export const getRemovedIds = () => removedIds;

export const removePackage = (id) => {
  if (!removedIds.includes(id)) {
    removedIds = [...removedIds, id];
    listeners.forEach((listener) => listener(removedIds));
  }
};

export const subscribeToComparison = (listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
