// This site's own SpaceDash blocks: each section of a page is a small form in the editor.
// Every block writes the same code the pages use:
//   {% set sectionTitle = "..." %}
//   {% include "partials/textList.njk" %}
// All of a block's values are always written, even empty ones, so one block's text can't
// carry over into the next block on the page.
(function () {
  var text = (name, label, extra) => Object.assign({ name: name, label: label, widget: "string", required: false }, extra);
  var long = (name, label, extra) => Object.assign({ name: name, label: label, widget: "text", required: false }, extra);
  var rich = (name, label, extra) => Object.assign({ name: name, label: label, widget: "markdown", buttons: ["bold", "italic", "link", "bulleted-list"], editor_components: [], required: false }, extra);
  var pick = (name, label, options, value) => ({ name: name, label: label, widget: "select", options: options, default: value, required: false });
  var date = (name, label) => ({ name: name, label: label, widget: "datetime", format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false, picker_utc: true, required: false });

  var heading = text("sectionTitle", "Heading");
  var linkText = text("sectionLinkText", "Button text");
  var linkUrl = text("sectionLinkUrl", "Button address", { hint: "e.g. /questions/ or https://..." });
  var link2Text = text("sectionLink2Text", "Second button text");
  var link2Url = text("sectionLink2Url", "Second button address");
  var background = (value) => pick("sectionBg", "Background", [
    { label: "Night sky", value: "night" },
    { label: "Deep space", value: "deep" },
    { label: "Paper", value: "paper" },
    { label: "Sand", value: "sand" },
  ], value);
  var art = pick("sectionArt", "Space picture", [
    { label: "None", value: "none" },
    { label: "Ringed planet", value: "planet" },
    { label: "Orbits", value: "orbits" },
    { label: "Constellation", value: "stars" },
    { label: "Moon", value: "moon" },
  ], "none");
  var numbered = (n) => [text("step" + n + "Title", "Step " + n + " heading"), long("step" + n + "Text", "Step " + n + " text")];
  var fact = (n) => [text("fact" + n + "Label", "Fact " + n + " label"), text("fact" + n + "Value", "Fact " + n + " value")];

  var blocks = [
    { id: "launchHero", label: "Rocket launch opening", file: "launchHero", summary: "heroTitle", fields: [
      text("heroTitle", "Heading"), long("heroLead", "Intro"),
      text("heroAction", "Button text"), text("heroLink", "Button address"),
      text("heroAction2", "Second button text"), text("heroLink2", "Second button address"),
    ] },
    { id: "pageHero", label: "Page opening", file: "pageHero", summary: "heroTitle", fields: [
      text("heroTitle", "Heading"), long("heroLead", "Intro"),
      text("heroAction", "Button text"), text("heroLink", "Button address"),
      pick("heroArt", "Space picture", [{ label: "None", value: "none" }, { label: "Moon", value: "moon" }], "none"),
    ] },
    { id: "quickFacts", label: "Quick facts strip", file: "quickFacts", summary: "fact1Value", fields: [].concat(fact(1), fact(2), fact(3), fact(4), fact(5)) },
    { id: "textList", label: "Text and list", file: "textList", summary: "sectionTitle", fields: [
      heading, rich("sectionText", "Text"), text("listTitle", "List heading"), rich("sectionList", "List"), background("night"), art,
    ] },
    { id: "cohortTracker", label: "Cohort tracker", file: "cohortTracker", summary: "runningTitle", fields: [
      date("cohortStart", "First Thursday"), date("cohortEnd", "Last Thursday"),
      text("runningTitle", "Heading during a cohort"),
      text("waitingTitle", "Heading between cohorts"), long("waitingText", "Text between cohorts"),
      text("noEventsText", "Text when no events are coming up"),
      linkText, linkUrl, link2Text, link2Url,
    ] },
    { id: "numberedSteps", label: "Numbered steps", file: "numberedSteps", summary: "sectionTitle", fields: [].concat(
      [heading, pick("stepsCount", "Numbers", [{ label: "Count up", value: "up" }, { label: "Count down", value: "down" }], "up")],
      numbered(1), numbered(2), numbered(3), numbered(4), [background("paper")]
    ) },
    { id: "bigNumbers", label: "Big numbers", file: "bigNumbers", summary: "sectionTitle", fields: [
      heading, text("number1", "First number"), long("number1Text", "First text"),
      text("number2", "Second number"), long("number2Text", "Second text"),
      text("number3", "Third number"), long("number3Text", "Third text"),
      background("sand"), art,
    ] },
    { id: "numberAndText", label: "Big number and text", file: "numberAndText", summary: "sectionTitle", fields: [
      text("number1", "Big number"), long("number1Text", "Under the number"),
      heading, rich("sectionText", "Text"), linkText, linkUrl, link2Text, link2Url, background("deep"),
    ] },
    { id: "textAndButton", label: "Text and button", file: "textAndButton", summary: "sectionTitle", fields: [
      heading, rich("sectionText", "Text"), linkText, linkUrl, link2Text, link2Url, background("night"),
    ] },
    { id: "questionsList", label: "Questions list", file: "questionsList", summary: "sectionTitle", fields: [
      heading,
      pick("questionsGroup", "Which questions", [{ label: "All", value: "" }, { label: "Accelerator", value: "Accelerator" }, { label: "Pre-Accelerator", value: "Pre-Accelerator" }], ""),
      background("paper"),
    ] },
  ];

  var VALUE = '"(?:[^"\\\\]|\\\\.)*"';

  blocks.forEach(function (b) {
    var names = b.fields.map(function (f) { return f.name; });
    var include = '{% include "partials/' + b.file + '.njk" %}';
    var sets = names.length ? "(?:{%\\s*set\\s+(?:" + names.join("|") + ")\\s*=\\s*" + VALUE + "\\s*%}\\s*\\n?)*" : "";
    var booleans = b.fields.filter(function (f) { return f.widget === "boolean"; }).map(function (f) { return f.name; });

    window.CMS.registerEditorComponent({
      id: "site-" + b.id,
      label: b.label,
      fields: b.fields,
      collapsed: true,
      summary: b.summary ? "{{fields." + b.summary + "}}" : undefined,
      pattern: new RegExp("^" + sets + '{%\\s*include\\s+"partials/' + b.file + '\\.njk"\\s*%}'),
      fromBlock: function (match) {
        var data = {};
        var re = /{%\s*set\s+(\w+)\s*=\s*("(?:[^"\\]|\\.)*")\s*%}/g;
        var m;
        while ((m = re.exec(match[0]))) data[m[1]] = JSON.parse(m[2]);
        booleans.forEach(function (k) { data[k] = data[k] === "yes"; });
        return data;
      },
      toBlock: function (data) {
        var lines = names.map(function (k) {
          var v = data[k];
          if (booleans.indexOf(k) > -1) v = v ? "yes" : "no";
          return "{% set " + k + " = " + JSON.stringify(String(v == null ? "" : v)) + " %}";
        });
        return lines.concat(include).join("\n");
      },
      toPreview: function () { return "<strong>" + b.label + "</strong>"; },
    });
  });
})();
