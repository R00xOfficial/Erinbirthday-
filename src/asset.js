// Resolves a path inside /public against the deployed base URL, so the site
// works from a sub-path (GitHub Pages) as well as from a domain root.
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
