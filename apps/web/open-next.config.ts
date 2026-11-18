import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();
// Tri Nguyen: Keep useWorkerdCondition off. Removing it in 35983a0 broke every Cloudflare build after that commit.
config.cloudflare = { ...config.cloudflare, useWorkerdCondition: false };

export default config;
