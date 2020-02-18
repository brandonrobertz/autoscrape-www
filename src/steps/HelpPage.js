import React from 'react'
import { connect } from 'react-redux'

import 'steps/HelpPage.css'

class HelpPage extends React.Component {
  render() {
    return (
      <div id="help-page">
        <h1>Help!</h1>
        <p>
          AutoScrape works in three basic phases:
          <ol>
            <li>scrape — crawl a website and/or interact with forms</li>
            <li>build extractor — tell AutoScrape how to pull data out of web pages</li>
            <li>download data — use an extractor to gather data and convert it into a spreadsheet/JSON</li>
          </ol>
        </p>
        <h2>Scraper</h2>
        <p>
          Crawling an interactive page and interacting with search forms is one of the most complicated parts of scraping web pages. AutoScrape makes this easier by automatically scraping forms as long as the user can provide the following information:
          <ul>
            <li>Some text that appears inside the form. This needs to be unique and <i>inside</i> the form.</li>
            <li>What form fields, if any, need to have text entered into them, be checked, etc.</li>
            <li>And, optionally, how to find a button or link that retrieves the next page of results. This assumes the result page is paginated.</li>
          </ul>
        </p>
        <p>
          Additionally, AutoScrape has a variety of other options that control things like:
          <ul>
            <li>Max click depth — how deep to click into a page before going back.</li>
            <li>Max results pages — how many results pages to fetch, after submitting a form.</li>
            <li>Page wait — how many seconds to wait after clicking a page or submitting a form. If the page isn't loaded by then, AutoScrape will fail.</li>
            <li>Priority links — if a link's text matches any of these, then it will be clicked first. You can use this to go past things like clicking "Accept" buttons before getting to a search form.</li>
            <li>Ignore links — if a link's text matches any of these, then it will be ignored. Use this to ignore things like help popups or contact forms.</li>
          </ul>
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
}

export default HelpPage;
