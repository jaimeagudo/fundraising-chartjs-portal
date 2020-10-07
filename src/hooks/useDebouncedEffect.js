import { useCallback, useEffect } from 'react';

const useDebouncedEffect = (effect, deps, delay) => {
    const callback = useCallback(effect, deps);

    useEffect(() => {
        const handler = setTimeout(callback, delay);
        return () => {
            console.log("cancelling")
            clearTimeout(handler);
        }
    }, [callback, delay, deps]);
}

export default useDebouncedEffect;
