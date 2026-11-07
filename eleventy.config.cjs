const DAY = 86400000;
const iso = (t) => new Date(t).toISOString().slice(0, 10);
const label = (t) => new Date(t).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "UTC" });

// the lit side of a moon of radius 14 that fills as the weeks go by (share: 0 to 1)
const moon = (share) => {
  const rx = (Math.abs(Math.cos(Math.PI * share)) * 14).toFixed(2);
  return `M0-14A14 14 0 0 1 0 14A${rx} 14 0 0 ${share < 0.5 ? 0 : 1} 0-14Z`;
};

// A cohort's Thursdays and where it's up to, from the dates in the Cohort tracker block, so
// the home page says the right thing without anyone remembering to change it.
function cohortPlan(start, end) {
  const from = Date.parse(start);
  const to = Date.parse(end);
  if (Number.isNaN(from) || Number.isNaN(to)) return { weeks: [], state: "over", done: 0 };
  const today = iso(Date.now());
  const weeks = [];
  for (let t = from; t <= to; t += 7 * DAY) weeks.push({ n: weeks.length + 1, date: label(t), done: iso(t) < today, next: false });
  weeks.forEach((w) => { w.moon = moon(w.n / weeks.length); });
  const upcoming = weeks.find((w) => !w.done);
  if (upcoming) upcoming.next = true;
  return {
    weeks,
    state: today < iso(from) ? "soon" : today <= iso(to) ? "running" : "over",
    start: label(from),
    end: label(to),
    done: weeks.filter((w) => w.done).length,
  };
}

module.exports = (eleventyConfig) => {
  const config = require("spaceclub")(eleventyConfig);
  eleventyConfig.addFilter("cohortPlan", cohortPlan);
  return config;
};
