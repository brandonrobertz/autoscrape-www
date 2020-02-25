import React from 'react'

import 'steps/HelpPage.css'

class HelpPage extends React.Component {
  constructor(props) {
    super(props);
    this.walkthrough = [{
        image: "/walkthrough/01-go-to-search-form.png",
        text: <span>First, you want to pull up the search form you want to scrape. Make note of the URL, we'll need this later.<br/><br/><span className="warning"><span className="note">NOTE</span> If you don't need to interact with search forms, you can <span className="skip-link" onClick={this.jumpToExtractorStep}>skip to the extractor builder step by clicking here</span>.</span></span>,
      }, {
        image: "/walkthrough/02-open-options.png",
        text: "Back in the AutoScrape UI, click the 'Open Options' button. A dropdown will appear.",
      }, {
        image: "/walkthrough/03-need-to-fill-form-text.png",
        text: "Below, you'll find the 'Form text' field. We're going to find some unique text that AutoScrape can use to identify the form you want to scrape and paste it here.",
      }, {
        image: "/walkthrough/04-copy-form-text.png",
        text: "Here, we found a sentence that only appears inside the form and copied it. Do the same with the page you'd like to scrape.",
      }, {
        image: "/walkthrough/05-paste-form-text.png",
        text: "Paste the text in the 'Form text' field.",
      }, {
        image: "/walkthrough/06-need-to-fill-next.png",
        text: "Next, we're going to fill the 'Next page button text' field.",
      }, {
        image: "/walkthrough/07-submit-form.png",
        text: "To find the next page button text, you might need to submit your form. That's what we're doing here.",
      }, {
        image: "/walkthrough/08-find-next-button-text.png",
        text: "At the bottom of the results page, we can see a next button. Its text is 'Next'. Case is important here.",
      }, {
        image: "/walkthrough/09-paste-next-text.png",
        text: "Back in the AutoScrape UI, we paste our next button text into the field. Now AutoScrape will be able to find and click any next buttons on results pages.",
      }, {
        image: "/walkthrough/09-open-form-filler-builder.png",
        text: "Now we're going to tell AutoScrape how to fill out the form. To do this, open the search form filler button. A dropdown menu will appear.",
      }, {
        image: "/walkthrough/10a-form-input-types.png",
        text: "Back on the site we want to scrape, we can see all the inputs on the left. In this case, I want to set the first date field with a specific date.",
      }, {
        image: "/walkthrough/10b-form-input-types-annotated.png",
        text: "AutoScrape sees form fields based on their type and their position. Here's a breakdown of how AutoScrape views the current search form. You can see that the date field we want to fill out is the first date input field.",
      }, {
        image: "/walkthrough/11-add-filler-instruction.png",
        text: "In the form filler UI, we select the date input, first date input and a specific date to fill in YYYY-MM-DD format.",
      }, {
        image: "/walkthrough/12-input-added.png",
        text: "Once you've clicked 'Add' the input is saved. You can delete it by clicking the X. You can also add more fields.",
      }, {
        image: "/walkthrough/13-add-url.png",
        text: "Finally, we paste the URL to the search form into the URL input field and click 'Start'. The scrape will begin.",
      }, {
        image: "/walkthrough/14.png",
        text: "AutoScrape will output information about what's going on. If there are other people using AutoScrape, you may have to wait for their scrapes to complete before yours will start...",
      }, {
        image: "/walkthrough/15-running-screenshot.png",
        text: "Once AutoScrape is running, it will output screenshots of the current page that's being visited.",
      }, {
        image: "/walkthrough/16-scrape-complete-click-build-extractor.png",
        text: "Once the scrape is complete, the UI will display a list of files scraped. This is just informational. Click the 'Build Extractor' button to continue.",
      }, {
        name: "build-extractor-step",
        image: "/walkthrough/17-load-builder-find-records.png",
        text: "This is the build extractor page. AutoScrape will render the crawled pages. Find one with results that you'd like to scrape on it.",
      }, {
        image: "/walkthrough/18-add-and-name-first-column.png",
        text: "Find the first record on the page. If there's only one, that's fine. Click the first value you'd like to extract for that record and give it a label. This will become the first column of your data. In the example above, the column header will be 'name' and the first row's value will be 'VARIOUS VENDORS - STATE CONTRACTS'. The second will be 'RESERVED'.",
      }, {
        image: "/walkthrough/19-optional.png",
        text: "Here, we've added all the values in the first record that we'd like to be extracted as columns in our final data. In this last description column, that hasn't been saved yet, we've marked it as optional. By default, AutoScrape's extractor does strict matching. So if a record appears that is missing one of the fields you've marked, it will not be extracted. Marking a field optional will allow the record to be extracted with blank values.",
      }, {
        image: "/walkthrough/20-builder-complete.png",
        text: "When done, click the orange play button above. This will close the builder.",
      }, {
        image: "/walkthrough/21-go-to-download.png",
        text: "Continue to the download page.",
      }, {
        image: "/walkthrough/22-download-data.png",
        text: "Now you can download your extracted data as a spreadsheet (CSV) or as JSON. You're all done!",
    }]
    this.state = {
      walkthroughStep: 0,
      showWalkthrough: true,
    };
  }

  jumpToExtractorStep = () => {
    this.walkthrough.forEach((r, i) => {
      if (r.name === "build-extractor-step") {
        this.setState({
          walkthroughStep: i
        });
      }
    });
  }

  prevWalkthroughPage = () => {
    if (!this.state.walkthroughStep) return;
    this.setState({
      walkthroughStep: this.state.walkthroughStep - 1
    });
  }

  nextWalkthroughPage = () => {
    if (this.state.walkthroughStep === this.walkthrough.length) return;
    this.setState({
      walkthroughStep: this.state.walkthroughStep + 1
    });
  }

  renderWalkthrough = () => {
    const stepIndex = this.state.walkthroughStep;
    const data = this.walkthrough[stepIndex];
    return (
      <div id="walkthrough">
        <div id="image-container">
          <img src={ data.image }
            alt="AutoScrape Walkthrough Screenshot" />
        </div>
        <div id="bottom-bar">
          <div className="text">
            { data.text }
          </div>
          <div className="controls">
            <button type="button"
              disabled={!this.state.walkthroughStep}
              onClick={this.prevWalkthroughPage}>Prev</button>
            <button type="button"
              disabled={this.state.walkthroughStep === this.walkthrough.length}
              onClick={this.nextWalkthroughPage}>Next</button>
          </div>
        </div>
      </div>
    );
  }

  longformHelp() {
    return (
      <div id="help-page">
        <h1>Help!</h1>
        <p>
          AutoScrape works in three basic phases:
        </p>
        <ol>
          <li>scrape — crawl a website and/or interact with forms</li>
          <li>build extractor — tell AutoScrape how to pull data out of web pages</li>
          <li>download data — use an extractor to gather data and convert it into a spreadsheet/JSON</li>
        </ol>
        <h2>Scraper</h2>
        <p>
          Crawling an interactive page and interacting with search forms is one of the most complicated parts of scraping web pages. AutoScrape makes this easier by automatically scraping forms as long as the user can provide the following information:
        </p>
        <ul>
          <li>Some text that appears inside the form. This needs to be unique and <i>inside</i> the form.</li>
          <li>What form fields, if any, need to have text entered into them, be checked, etc.</li>
          <li>And, optionally, how to find a button or link that retrieves the next page of results. This assumes the result page is paginated.</li>
        </ul>
        <p>
          Additionally, AutoScrape has a variety of other options that control things like:
        </p>
        <ul>
          <li>Max click depth — how deep to click into a page before going back.</li>
          <li>Max results pages — how many results pages to fetch, after submitting a form.</li>
          <li>Page wait — how many seconds to wait after clicking a page or submitting a form. If the page isn't loaded by then, AutoScrape will fail.</li>
          <li>Priority links — if a link's text matches any of these, then it will be clicked first. You can use this to go past things like clicking "Accept" buttons before getting to a search form.</li>
          <li>Ignore links — if a link's text matches any of these, then it will be ignored. Use this to ignore things like help popups or contact forms.</li>
        </ul>
        <p>
          A full list of options and descriptions can be found <a href="https://github.com/brandonrobertz/autoscrape-py#manual-config-based-scraper" target="_blank" rel="noopener noreferrer">on the GitHub page</a>.
        </p>
        <h2>Extractor-building</h2>
        <p>
          Extractor building is a way of telling AutoScrape how to take a webpage and turn it into a series of records. This will be applied to all pages, resulting in a spreadsheet of data.
        </p>
        <p>
          To build an extractor, navigate through your scraped web pages and find one that contains records you want to extract. If the page has multiple records on it, scroll to the first one.
        </p>
        <p>
          Click on the first value of the record that you'd like to extract. A menu will pop up, asking you to give it a label. Once you hit save, the menu will close and your first column has been created. Do this for the remaining values in the record. As you continue, matches will be marked in green. This shows you what data will ultimately be extracted, in addition to your labeled record.
        </p>
        <p>
          Once you've set up all your columns, hit the green arrow button at the top of the screen. Now you are ready to continue to the data download page.
        </p>
      </div>
    );
  }

  render() {
    if (this.state.showWalkthrough) {
      return this.renderWalkthrough();
    }
    return this.longformHelp();
  }
}

export default HelpPage;
