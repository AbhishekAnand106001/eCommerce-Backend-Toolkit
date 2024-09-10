import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

// Self-executing async function to connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// Redis event listener for connection errors
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

export default redisClient;
