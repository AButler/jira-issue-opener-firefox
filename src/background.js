var baseUrl, defaultProject;

async function initialize() {
  const items = await browser.storage.sync.get({
    baseUrl: null,
    defaultProject: null,
  });

  baseUrl = items.baseUrl;
  defaultProject = items.defaultProject;
}

function openUrl(url, disposition) {
  switch (disposition) {
    case "currentTab":
      browser.tabs.update({ url: url });
      break;
    case "newForegroundTab":
      browser.tabs.create({ url: url });
      break;
    case "newBackgroundTab":
      browser.tabs.create({ url: url, active: false });
      break;
  }
}

function onOmniboxTextEntered(text, disposition) {
  if (!baseUrl) {
    return;
  }

  var url = null;
  var id = text;

  if (id) {
    id = id.trim().replace(" ", "-");

    if (JiraHelpers.isNumberOnly(id) && defaultProject) {
      id = `${defaultProject}-${id}`;
    }

    if (JiraHelpers.isJiraId(id)) {
      url = JiraHelpers.generateJiraIssueUrl(baseUrl, id);
    } else {
      url = JiraHelpers.generateJiraSearchUrl(baseUrl, defaultProject, text);
    }
  } else {
    url = JiraHelpers.generateJiraIssueListUrl(baseUrl);
  }

  openUrl(url, disposition);
}

browser.omnibox.onInputEntered.addListener(onOmniboxTextEntered);
initialize();
