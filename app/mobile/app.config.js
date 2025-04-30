export default ({ config }) => {
    return {
        ...config,
        extra: {
            apiUrl: process.env.API_URL,
            apiKey: process.env.API_KEY,
            environment: process.env.NODE_ENV,
        }
    };
};
