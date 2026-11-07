// Site: http://localhost:8096  SpaceDash with local files, no sign-in: http://localhost:8096/admin/
// Its real preview comes from SpaceClub's server on :8092 (run `npm run build` once so it has the site's assets)
module.exports = {
  apps: [
    { name: 'galactic-horizon-website', script: 'npm', args: 'start -- --port 8096', cwd: __dirname },
    { name: 'galactic-horizon-website-cms', script: 'npx', args: 'decap-server', cwd: __dirname, env: { PORT: '8097' } },
  ],
};
