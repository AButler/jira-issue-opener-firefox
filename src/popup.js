"use strict";

let defaultProject = null;
let baseUrl = null;
const enterKeyCode = 13;

async function initialize(e) {
  initializeLocale();

  const items = await browser.storage.sync.get({
    baseUrl: null,
    defaultProject: null,
  });

  if (!items || !items.baseUrl) {
    browser.runtime.openOptionsPage();
    return;
  }

  baseUrl = items.baseUrl;
  defaultProject = items.defaultProject;

  browser.tabs
    .executeScript(null, { code: "window.getSelection().toString();" })
    .then(onTextSelected);

  document.getElementById("submit").addEventListener("click", onSubmit);
  document.getElementById("cancel").addEventListener("click", onCancel);
  document.getElementById("options").addEventListener("click", onOptionsClick);

  var idField = document.getElementById("id");
  idField.addEventListener("keypress", onIdFieldKeypress);
  idField.focus();
}

function initializeLocale() {
  document.getElementById("lblHeader").innerText =
    browser.i18n.getMessage("popupHeader");
  document.getElementById("lblId").innerText =
    browser.i18n.getMessage("popupIdLabel");
  document.getElementById("options").innerText =
    browser.i18n.getMessage("popupOptionsLabel");
  document.getElementById("submit").innerText =
    browser.i18n.getMessage("popupSubmitLabel");
  document.getElementById("cancel").innerText =
    browser.i18n.getMessage("popupCancelLabel");
  document.getElementById("error").innerText = browser.i18n.getMessage(
    "popupInvalidJiraMessage"
  );
}

async function onTextSelected(selection) {
  if (selection && selection.length > 0) {
    var handled = await handleJiraLink(selection[0]);
    if (handled) {
      window.close();
      return;
    }
  }
}

function onIdFieldKeypress(e) {
  if (e.keyCode === enterKeyCode) {
    onSubmit();
  }
}

async function onSubmit() {
  console.log("submit");
  var id = document.getElementById("id").value;

  var handled = await handleJiraLink(id);
  if (handled) {
    window.close();
    return;
  }

  document.getElementById("error").classList.remove("hidden");
}

function onCancel() {
  window.close();
}

function onOptionsClick() {
  browser.runtime.openOptionsPage();
}

async function handleJiraLink(id) {
  if (!id) {
    return false;
  }

  id = id.trim().replace(" ", "-");

  if (JiraHelpers.isNumberOnly(id) && defaultProject) {
    id = `${defaultProject}-${id}`;
  }

  if (id.startsWith(`${defaultProject}-${defaultProject}-`)) {
    id = id.substring(defaultProject.length + 1);
  }

  if (!JiraHelpers.isJiraId(id)) {
    return false;
  }

  const tabs = await browser.tabs.query({ active: true, currentWindow: true });

  let index = 0;
  if (tabs && tabs.length) {
    index = tabs[0].index + 1;
  }

  await browser.tabs.create({
    index: index,
    url: JiraHelpers.generateJiraIssueUrl(baseUrl, id),
  });

  return true;
}

document.addEventListener("DOMContentLoaded", initialize);
