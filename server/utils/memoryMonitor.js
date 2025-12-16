const startMemoryMonitor = () => {
    // Run every 5 minutes
    setInterval(() => {
        const used = process.memoryUsage();
        console.log(`[Memory Monitor] RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB | Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB | Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`);

        // Warning if heap usage is high (e.g., > 400MB) which scares the 512MB limit
        if (used.heapUsed > 400 * 1024 * 1024) {
            console.warn('⚠️ HIGH MEMORY USAGE DETECTED! Potential OOM risk.');
        }
    }, 300000); // 5 minutes = 300000 ms

    console.log('Memory Monitor initialized (logging every 5 mins)');
};

module.exports = startMemoryMonitor;
