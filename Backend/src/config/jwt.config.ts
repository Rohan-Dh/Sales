export default () => ({
  jwt: {
    secretKey: process.env.JWT_SECRET,
    expiry: process.env.EXPIRY ?? '1d',
  },
});
