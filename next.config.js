//secure method to retrive secrets from .env file

const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  publicRuntimeConfig: {
    aiApiKey: process.env.AI_API_KEY,
  },
};
