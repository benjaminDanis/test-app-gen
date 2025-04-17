import pkg from '@next/env';

const { loadEnvConfig } = pkg;
loadEnvConfig('./', process.env.NODE_ENV !== 'production');
