/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    env: {
        SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION || "true",
      },
};

export default config;
