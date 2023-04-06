async function initialize() {
  initializeLocale();

  document.getElementById("submit").addEventListener("click", onSubmit);
  document.getElementById("cancel").addEventListener("click", onCancel);

  const items = await browser.storage.sync.get({
    baseUrl: "https://",
    defaultProject: null,
  });

  document.getElementById("baseUrl").value = items.baseUrl;
  document.getElementById("defaultProject").value = items.defaultProject;
}

function initializeLocale() {
  document.getElementById("lblBaseUrl").innerText = browser.i18n.getMessage(
    "optionsBaseUrlLabel"
  );
  document.getElementById("lblDefaultProject").innerText =
    browser.i18n.getMessage("optionsDefaultProjectLabel");
  document.getElementById("baseUrl").placeholder = browser.i18n.getMessage(
    "optionsBaseUrlPlaceholder"
  );
  document.getElementById("defaultProject").placeholder =
    browser.i18n.getMessage("optionsDefaultProjectPlaceholder");
  document.getElementById("submit").innerText =
    browser.i18n.getMessage("optionsSubmitLabel");
  document.getElementById("cancel").innerText =
    browser.i18n.getMessage("optionsCancelLabel");
}

async function onSubmit() {
  var baseUrl = document.getElementById("baseUrl").value.trim();
  var defaultProject = document.getElementById("defaultProject").value.trim();

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  await browser.storage.sync.set({
    baseUrl: baseUrl,
    defaultProject: defaultProject,
  });

  window.close();
}

function onCancel() {
  window.close();
}

document.addEventListener("DOMContentLoaded", initialize);
