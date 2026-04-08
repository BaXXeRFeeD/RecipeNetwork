import { useEffect, useState } from 'react';

const LOCAL_STORAGE_EVENT = 'local-storage';

function useLocalStorage(key, initialValue) {
    const readValue = () => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState(readValue);

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(readValue()) : value;

            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));

            window.dispatchEvent(
                new CustomEvent(LOCAL_STORAGE_EVENT, { detail: { key, value: valueToStore } })
            );
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key !== key) return;
            setStoredValue(readValue());
        };

        const onCustom = (e) => {
            if (!e?.detail || e.detail.key !== key) return;
            setStoredValue(e.detail.value);
        };

        window.addEventListener('storage', onStorage);
        window.addEventListener(LOCAL_STORAGE_EVENT, onCustom);

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener(LOCAL_STORAGE_EVENT, onCustom);
        };
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
