// === Gear Inventory — Google Apps Script ===
// Paste this into Extensions > Apps Script in your Google Sheet.
// Deploy as: Web app, execute as "Me", access "Anyone".

var SHEET_NAME = "Inventory";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var action = (e.parameter && e.parameter.action) || "";

  if (e.postData) {
    var body = JSON.parse(e.postData.contents);
    action = body.action || action;
  }

  var result;
  try {
    if (action === "list") {
      result = listItems();
    } else if (action === "add") {
      result = addItem(body);
    } else if (action === "update") {
      result = updateItem(body);
    } else if (action === "delete") {
      result = deleteItem(body);
    } else {
      result = listItems();
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["ID", "Name", "Serial", "Category", "Code", "Notes", "Value", "Date Added"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
  }
  return sheet;
}

function listItems() {
  var sheet = getOrCreateSheet();
  var data = sheet.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === "") continue;
    items.push({
      id: data[i][0],
      name: data[i][1],
      serial: data[i][2],
      category: data[i][3],
      code: data[i][4],
      notes: data[i][5],
      value: data[i][6] || "",
      date_added: data[i][7]
    });
  }
  return { items: items };
}

function addItem(body) {
  var sheet = getOrCreateSheet();
  var id = Utilities.getUuid();
  var now = new Date().toISOString().split("T")[0];
  sheet.appendRow([
    id,
    body.name || "",
    body.serial || "",
    body.category || "",
    body.code || "",
    body.notes || "",
    body.value || "",
    now
  ]);
  return { success: true, id: id };
}

function updateItem(body) {
  var sheet = getOrCreateSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === body.id) {
      if (body.name !== undefined) sheet.getRange(i + 1, 2).setValue(body.name);
      if (body.serial !== undefined) sheet.getRange(i + 1, 3).setValue(body.serial);
      if (body.category !== undefined) sheet.getRange(i + 1, 4).setValue(body.category);
      if (body.code !== undefined) sheet.getRange(i + 1, 5).setValue(body.code);
      if (body.notes !== undefined) sheet.getRange(i + 1, 6).setValue(body.notes);
      if (body.value !== undefined) sheet.getRange(i + 1, 7).setValue(body.value);
      return { success: true };
    }
  }
  return { error: "Item not found" };
}

function deleteItem(body) {
  var sheet = getOrCreateSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === body.id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: "Item not found" };
}
