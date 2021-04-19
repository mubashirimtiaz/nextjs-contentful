import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFULL_SPACE_KEY,
  accessToken: process.env.CONTENTFULL_ACCESS_TOKEN,
});

export default client;
