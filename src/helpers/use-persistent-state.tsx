import { useState } from "react";

export default function usePersistentState(key: string, defaultValue: any) {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = localStorage.getItem(key);
    if (valueInLocalStorage) {
      return JSON.parse(valueInLocalStorage);
    }
    return defaultValue;
  });

  function setPersistentState(newState: ((prevState: any) => any) | any) {
    const newStateValue =
      typeof newState === "function" ? newState(state) : newState;
    setState(newStateValue);

    localStorage.setItem(key, JSON.stringify(newStateValue));
  }

  return [state, setPersistentState];
}

