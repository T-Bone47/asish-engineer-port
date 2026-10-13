/** Tailwind CSS v4 — CSS-first config, no tailwind.config.js needed.
 *  Design tokens themselves live in app/globals.css under @theme. */
const config = {
  plugins: {
    // v4 root-level plugin. Kept here deliberately: with it loaded, the
    // generated CSS chunk returns a 21-byte "Internal Server Error" body
    // from the plugin (verified: curl /_next/static/chunks/<hash>.css -
    //> HTTP 500, body=21 bytes, "Internal Server Error"). The plugin is
    // the first isolation step to confirm whether the failure is in the
    // loader or in the @tailwindcss/postcss plugin itself.
    "@tailwindcss/postcss": {},
  },
};

export default config;
