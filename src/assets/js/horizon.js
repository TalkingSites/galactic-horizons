// The home page's rocket: it lifts off the planet and flies the trajectory, passing the
// twelve weeks on the way. Without JavaScript or with reduced motion it sits at the top.
(function () {
  var path = document.getElementById("gh-trajectory");
  var group = document.getElementById("gh-ticks");
  var rocket = document.getElementById("gh-rocket");
  if (!path || !group || !rocket) return;
  var length = path.getTotalLength();
  var ticks = [];
  for (var i = 0; i < 12; i++) {
    var at = (i + 1) / 13;
    var p = path.getPointAtLength(length * at);
    var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.setAttribute("r", 4);
    dot.setAttribute("class", "gh-tick");
    group.appendChild(dot);
    ticks.push({ at: at, dot: dot });
  }
  function place(t) {
    var a = path.getPointAtLength(length * t);
    var b = path.getPointAtLength(Math.min(length, length * t + 1));
    var c = t >= 1 ? path.getPointAtLength(length - 1) : a;
    var angle = (Math.atan2(t >= 1 ? a.y - c.y : b.y - a.y, t >= 1 ? a.x - c.x : b.x - a.x) * 180) / Math.PI;
    rocket.setAttribute("transform", "translate(" + a.x + " " + a.y + ") rotate(" + angle + ")");
    path.style.strokeDashoffset = 1 - t;
    ticks.forEach(function (k) { k.dot.style.opacity = t >= k.at ? 1 : 0; });
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return place(1);
  var start = null;
  var DURATION = 3400;
  place(0);
  requestAnimationFrame(function step(now) {
    start = start === null ? now : start;
    var x = Math.min(1, (now - start) / DURATION);
    place(x * x * (3 - 2 * x));
    if (x < 1) requestAnimationFrame(step);
  });
})();
