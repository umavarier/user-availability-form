import Memcached from 'memcached';

const memcached = new Memcached('localhost:11211', {
  retry: 10000,
  retries: 5,
  timeout: 5000
});

export const getFromCache = (key) => {
  return new Promise((resolve, reject) => {
    memcached.get(key, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const setInCache = (key, value) => {
  return new Promise((resolve, reject) => {
    memcached.set(key, value, 86400, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

