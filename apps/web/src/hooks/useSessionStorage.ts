import { useState, useEffect } from "react";

type SetValue<T> = T | ((val: T) => T);

function useSessionStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.log("Error accessing sessionStorage:", error);
    }
  }, [key]);

  const setValue = (value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      setState(valueToStore);
    } catch (error) {
      console.log("Error setting sessionStorage:", error);
    }
  };

  return [state, setValue] as const;
}

export default useSessionStorage;
