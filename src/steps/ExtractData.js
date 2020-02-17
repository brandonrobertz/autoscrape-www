const areas = {
  zip: "input#zip-selector",
  hext: "input#hext-selector",
  json: "pre#json-box",
};
const wrappers = {
  zip: "#zip-loader",
  hext: "#hext-loader",
};

const TEXT_EXTENSIONS = [
  "\.asp$",
  "\.aspx$",
  "\.axd$",
  "\.asx$",
  "\.asmx$",
  "\.ashx$",
  "\.cfm$",
  "\.yaws$",
  "\.html$",
  "\.htm$",
  "\.xhtml$",
  "\.jhtml$",
  "\.hta$",
  "\.jsp$",
  "\.jspx$",
  "\.wss$",
  "\.do$",
  "\.action$",
  "\.pl$",
  "\.php$",
  "\.php4$",
  "\.php3$",
  "\.phtml$",
  "\.rb$",
  "\.rhtml$",
  "\.shtml$",
  "\.xml$",
  "\.rss$",
  "\.svg$",
  "\.cgi$",
  "\.dll$",
  "\.axd$",
  "\.asx$",
  "\.asmx$",
  "\.ashx$",
  "\.aspx$",
  "\.xml$",
  "\.rss$",
  "\.atom$",
]

const checkWebExtension = (name) => {
  // AutoScrape directory files will always have an extension
  // TODO: handle other HTML-like non-.html extensions (e.g., .php)
  const re = RegExp(TEXT_EXTENSIONS.join("|"))
  if (name.match(re)) {
    return true;
  }
  return false;
};

const fromZipSelect = (file) => {
  return JSZip.loadAsync(file)
    .then(function(zip) {
      console.log("Unzipping");
      const promises =  [];
      zip.forEach((name, zipEntry) => {
        console.log("name", name);
        if (zipEntry.dir || !checkWebExtension(name))
          return;

        const p = zip.file(name)
          .async("string")
          .then((data) => {
            return {
              name: name,
              data: data
            };
          }).catch(e => {
            console.error("Error decompressing", e);
          });

        promises.push(p);
      });
      return Promise.all(promises);
    });
};

const fileToText = (file) => {
  return new Promise((res, rej) => {
    const filepath = file.name;
    const start = 0;
    const stop = file.size - 1;
    const blob = file.slice(start, stop + 1);
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target.readyState == 2) { // DONE
        res(e.target.result);
      }
    };
    reader.readAsText(blob);
  });
}

const extractJSON = (hext, html) => {
  const parsedHtml = new Module.Html(html);
  const rule = new Module.Rule(hext);
  const results = rule.extract(parsedHtml);
  console.log("Hext extraction response", results);
  return results;
}

const startExtraction = (zip, hext) => {
  console.log("startExtraction", zip);
  fromZipSelect(zip)
    .then((files) => {
      console.log("Done unzipping!");
      return files.map(f => {
        return f.data;
      }).map((html) => {
        return extractJSON(hext, html);
      });
    })
    .then((jsons) => {
      return jsons.filter(x => x);
    })
    .then((jsons) => {
      console.log("JSONS", jsons);
      if (!jsons) {
        $(areas.json).append("No results found.");
      } else {
        jsons.forEach((j) => {
          const parsed = JSON.stringify(j, null, 2);
          $(areas.json).append(parsed);
        });
      }
    });
};

const start = () => {
  console.log("starting");
  document.querySelector(areas.zip).addEventListener("change", (e) => {
    const zip = e.target.files[0];
    $(wrappers.zip).hide();
    $(wrappers.hext).show();
    document.querySelector(areas.hext).addEventListener("change", (e) => {
    $(wrappers.hext).hide();
      const file = e.target.files[0];
      fileToText(file).then((hext) => {
        startExtraction(zip, hext);
      })
    });
  });
};

$(document).ready(start);

/*
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="/app/favicon.ico" />
    <meta
                              name="viewport"
                              content="width=device-width, initial-scale=1, shrink-to-fit=no"
                              />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="/manifest.json" />
    <title>AutoScrape</title>
    <style>
    body {
      margin-top: 0;
      padding-top: 0;
    }
    .loader {
      padding-top: 10%;
      padding-bottom: 25px;
      font-size: 26px;
      text-align: center;
    }
    #json-wrapper {
      margin: 0 auto;
      display: table;
    }
    pre {
      font-size: 12px;
    }
    #header {
      display: flex;
      z-index: 999999;
      font-family: monospace;
    }
    #header .header-link {
      flex-grow: 2;
      text-align: center;
      text-decoration: none;
      color: black;
      height: 25px;
      padding-top: 12px;
    }
    #header .header-link:hover {
      background-color: #eee;
    }
    </style>
  </head>
  <body>

    <div id="header">
      <a href="/app" class="header-link">Scraper</a>
      <a href="/app/hext.html" class="header-link">Hext Template</a>
      <a href="/app/extract.html" class="header-link">Extractor</a>
    </div>
    <div id="zip-loader" class="loader">
      <p>Select an AutoScrape ZIP file.</p>
      <input id="zip-selector" type="file" />
    </div>

    <div id="hext-loader" class="loader" style="display: none">
      <p>Select a Hext template.</p>
      <input id="hext-selector" type="file" />
    </div>

    <div id="json-wrapper">
      <pre id="json-box"></pre>
    </div>

    <script
      src="https://code.jquery.com/jquery-3.3.1.min.js"
      integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
      crossorigin="anonymous"></script>
    <script
      type="text/javascript"
      src="/app/jszip.min.js"></script>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/gh/brandonrobertz/hext-emscripten/hext_wrapper.js">
    </script>
    <script type="text/javascript"
            src="/app/extract.js"></script>
  </body>
</html>
*/
