export const ENVIRONMENT = {
  IS_DEV: import.meta.env.DEV,
  IS_LOCAL: import.meta.env.MODE === 'local_dev',
  IS_DEBUG: !import.meta.env.PROD,
  IS_PRODUCTION: import.meta.env.PROD,
};

console.log('env', import.meta.env);
