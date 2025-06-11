// Contract call caching utility
class ContractCache {
    constructor(ttl = 2000) { // Default TTL of 2 seconds
        this.cache = new Map();
        this.ttl = ttl;
    }

    // Generate a cache key from the contract call parameters
    generateKey(address, functionName, args = []) {
        return `${address}-${functionName}-${JSON.stringify(args)}`;
    }

    // Get cached value if it exists and is not expired
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    // Set a value in the cache
    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    // Clear the entire cache
    clear() {
        this.cache.clear();
    }

    // Clear expired items from the cache
    clearExpired() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

// Create a singleton instance
const contractCache = new ContractCache();

export default contractCache; 