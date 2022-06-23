const performanceRecord = () => ({
    onEffect: (effect, { put }, model, actionType) => {
        return function* (...args) {
            const start = performance.now();
            yield effect(...args);
            console.log(`${actionType} ${performance.now() - start}`);
        };
    },
});

export default performanceRecord;