import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timeHandler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timeHandler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
