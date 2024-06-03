export const TokenCache = (): Map<any, any> => {
    const hashMap = new Map();

    setInterval(() => {
        hashMap.clear();
        console.log("Cache cleared!");
    }, 300000);

    return hashMap;
};