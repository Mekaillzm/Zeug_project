




function getCurrentSpreadSheet()
{
    //Sets hard-coded sheet value to be called by all other functions. Update with your sheet id.
    
    const SHEET_ID = "1R4zj426pQ49obUQt-rnaSwhDWDtHj2GWAbPgwJei1vc";
    var sheet = SpreadsheetApp.openById(SHEET_ID);
    return sheet;
}

function sendEmailUpdate(subject, body) {

  //Enter your email in A14 of the Information sheet
  sheet = getCurrentSpreadSheet().getSheetByName("Information");
  var recipient = sheet.getRange("A14").getValue();
  
  MailApp.sendEmail(recipient, subject, body);
}

function getMainSheet()
{
  //Gets the "Zeug" sheet, that contains all main data and updates. The sheet name will be updated according to the value in A10, in the Information Sheet
  var spreadSheet = getCurrentSpreadSheet()
  var infoSheet = spreadSheet.getSheetByName("Information");
  const SHEET_NAME = infoSheet.getRange("A10").getValue();

  var sheet = spreadSheet.getSheetByName(SHEET_NAME);
  return sheet;

}

function getSheetNames()
{
  var spreadSheet = getCurrentSpreadSheet()
  var infoSheet = spreadSheet.getSheetByName("Information");
  const NAMES = infoSheet.getRange("A10:A12").getValues();
  //Default values:
  //Zeug - main sheet - A10 - index 0
  //Dehnungs-Historie - stretch routine logs - A11 - index 1
  //Übungshistorie - exercise routine logs - A12 - index 2
  
  //The index values are hard-coded
  return NAMES;

}

function runOnEdit()
{
  onEdit(false);
}

function onEdit(e) {
  sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Check if the edit happened on the correct sheet and cell (A7)
  const ZEUG_INDEX = 0; //the index of the main sheet, Zeug or Stuff by default

  //Logger.log(sheet.getName() === getSheetNames()[ZEUG_INDEX][0]);
  if (sheet.getName() === getSheetNames()[ZEUG_INDEX][0]) {    

    var cellB7 = sheet.getRange("B7");
    var valueB7 = cellB7.getValue();
    
    var valueStretch = sheet.getRange("A7").getValue();
    var valueExercise = sheet.getRange("A9").getValue();
    var valueHaarwaschmittel = sheet.getRange("A17").getValue();
    var valueA13 = sheet.getRange("A12").getValue();
    var valueHaarol = sheet.getRange("A19").getValue();
    var valueAutoriefen = sheet.getRange("A24").getValue();
    var valueDatei = sheet.getRange("A29").getValue();
    var valueHandy = sheet.getRange("A32").getValue();

    // Check the value of B7 and toggle between 1 and 2
    if (valueStretch !== "" || valueA13 !== "")
    {
    var value = -1;
    if (valueB7 === 1) {
      value = 2;
    } else if (valueB7 === 2) {
      value = 1;
    }

    cellB7.setValue(value);

    const DEHNUNGS_INDEX = 1;
    updateHistory(getSheetNames()[DEHNUNGS_INDEX][0], valueB7);
    sheet.getRange("C7").setValue(new Date());
    }

    if (valueExercise !== "" || valueA13 !== "")
    {
    var cellB9 = sheet.getRange("B9");
    var valueB9 = cellB9.getValue();
    

    var exercises = ["Bizeps und Rücken", "Trizeps und Shulter", "Beine"];
    
    // Check the value of B7 and toggle between 1 and 2
    var value = -1; //1 = bic, 2 = tri, 3 = beine
    if (valueB9 === exercises[0]) {
      value = 2;
    } else if (valueB9 === exercises[1]) {
      value = 3;
    } else if (valueB9 === exercises[2]) {
      value = 1;
    }

    cellB9.setValue(exercises[value - 1]);

    const UBUNGS_INDEX = 2;
    updateHistory(getSheetNames()[UBUNGS_INDEX][0], exercises.indexOf(valueB9) + 1);
    sheet.getRange("C9").setValue(new Date());
    }

    if (valueHaarwaschmittel  !== "")
    {
      toggleBoolCell("17");
    }

    if (valueHaarol !== "")
    {
      toggleBoolCell("19");
    }


    if (valueAutoriefen !== "")
    {
      toggleBoolCell("24");
    }

    if (valueDatei !== "")
    {
      toggleBoolCell("29");
    }

    if (valueHandy !== "")
    {
      resetHandy(sheet);
    }
    // Clear the content of A7
    sheet.getRange("A7:A9").clearContent();
    sheet.getRange("A12").clearContent();
    sheet.getRange("A32").clearContent();

   // sheet.getRange("A12").clearContent();

  }
}




function toggleBoolCell(row)
{


    var sheet = getMainSheet();

    var cell = sheet.getRange("B" + row);
    var value = cell.getValue();

    sheet.getRange("C" + row).setValue(new Date());
    sheet.getRange("A" + row).clearContent();

    // Check the value and toggle between 1 and 2
    if (value === "Ja") {
      cell.setValue("Nein");
    } else if (value === "Nein") {
      cell.setValue("Ja");
    }
    else {
    Logger.log("Unexpected value in cell B" + row + ": " + value);
  }
  


}

function updateHistory(sheetName, type)
{
  var sheet =getCurrentSpreadSheet().getSheetByName(sheetName);
  var lRow = sheet.getLastRow();
  sheet.getRange(lRow + 1, 1).setValue(new Date());
  sheet.getRange(lRow + 1, 2).setValue(type);
  
}

function runCreateUpdateEmail()
{
  var sheet = getMainSheet();
  createUpdateEmail(sheet, "Test")
}

function createUpdateEmail(sheet, subject)
{

    var valueB7 = sheet.getRange("B7").getValue();
    var valueB9 = sheet.getRange("B9").getValue();
    var valueB17 = sheet.getRange("B17").getValue();
    var valueB19 = sheet.getRange("B19").getValue();
    var valueB24 = sheet.getRange("B24").getValue();
    var valueB29 = sheet.getRange("B29").getValue();
    var valueB32 = sheet.getRange("B32").getValue();

    var falligkeitsdatum = sheet.getRange("D32").getValue(); //falligkeitsdatum - due date

    var haarNachricht = (valueB17 == "Ja") ? "Wasch dir bitte die Haare.\n" : "";
    var haarolNachricht = (valueB19 === "Ja") ? "Heute solltest du Haaröl verwenden.\n" : "";
    var dateiNachricht = (valueB29 === "Ja") ? "Sichere die Datei.\n" : "";
    var autoriefenNachricht = (valueB24 === "Ja") ? "Füll die Luft in den Reifen nach.\n" : "";
    var handyNachricht = `Bezahl die Handyrechnung bis zum ${falligkeitsdatum}`;

    const HAAR = (haarNachricht === "" && haarolNachricht === "") ? "" : "\n\nHAAR\n";
    const AUTO = (autoriefenNachricht === "") ? "" : "\nAUTO\n";
    const TECHNIK = (dateiNachricht === "" && handyNachricht === "") ? "" : "\nTECHNIK\n";

    // `Nächste Dehnung: ${valueB7} \nNächste Übung: ${valueB9} \n\nHaarwaschmittel: ${valueB17} \nHaaröl: ${valueB19} \n\nAutoriefen: ${valueB24} //\nDateisicherung: ${valueB29}
    var nachricht = `Guten Tag!\nHier sind die Aufgaben für heute.\n\nNächste Dehnung: ${valueB7} \nNächste Übung: ${valueB9}${HAAR}${haarNachricht}${haarolNachricht}${AUTO}${autoriefenNachricht}${TECHNIK}${dateiNachricht}${handyNachricht}\n\nDas wäre alles.\n\nMit freundlichen Grüßen,\nZeug App`;

    sendEmailUpdate(subject, nachricht);

}

function timePassed(lastUpdatedDate, minDays) {
  var currentDate = new Date();

  if (!lastUpdatedDate) return true; // If no date is set, assume it needs an update
  var diffTime = currentDate - new Date(lastUpdatedDate); // Difference in time
  var diffDays = diffTime / (1000 * 3600 * 24); // Convert time difference to days
  return diffDays >= minDays; // Check if minDays days have passed
}

function dailyUpdate()
{
  toggleBoolCell("17"); //Configures Haarwaschmittel (Hair-wash)

    var sheet = getCurrentSpreadSheet();
  var currentDate = new Date();


    // Function to check if 2 weeks have passed since the last update

  // Check for B24 and C24
  var cellAutoriefen = sheet.getRange("B24");
  var lastUpdateAutoriefen = sheet.getRange("C24").getValue();
  var minZeit = sheet.getRange("D24").getValue();

  if (cellAutoriefen.getValue() === "Nein" && timePassed(lastUpdateAutoriefen, minZeit)) {
    cellAutoriefen.setValue("Ja");
    sheet.getRange("C24").setValue(currentDate);

  }

  // Check for B19 and C19
  var cellHaarol = sheet.getRange("B19");
  var lastUpdateHaarol = sheet.getRange("C19").getValue();
  minZeit = sheet.getRange("D19").getValue();
  if (cellHaarol.getValue() === "Nein" && timePassed(lastUpdateHaarol, minZeit)) {
    cellHaarol.setValue("Ja");
    sheet.getRange("C19").setValue(currentDate);
  }

  var cellDatei = sheet.getRange("B29");
  var lastUpdateDatei = sheet.getRange("C29").getValue();
  minZeit = sheet.getRange("D29").getValue();

  if (cellDatei.getValue() === "Nein" && timePassed(lastUpdateDatei, minZeit))
  {
    cellDatei.setValue("Ja");
    sheet.getRange("C29").setValue(currentDate);
  }

  var cellHandy = sheet.getRange("B32");
  var nextUpdateHandy = sheet.getRange("D32").getValue();
  

  if (cellHandy.getValue() === "Nein" && timePassed(nextUpdateHandy, -24))
  {
    cellHandy.setValue("Ja");
    sheet.getRange("C32").setValue(currentDate);
    

  }

  createUpdateEmail(sheet, `Tägliches Update: ${currentDate}`);


}

function hourlyUpdate()
{
  var sheet = getMainSheet();
  handyUpdate(sheet);

}
function handyUpdate(sheet)
{
  
  var falligkeitsdatum = sheet.getRange("D32").getValue();
  var heute = new Date();

  var intervall = (falligkeitsdatum - heute) / (1000 * 3600 * 24);
  const MINDESTENS_INTERVALL = 1;
  if (intervall < MINDESTENS_INTERVALL)
  {
    sendEmailUpdate(`WICHTIG: Hanyzahlung Errinerung: ${heute}`, `Bitte bezahlen Sie Ihre Handyrechnung bis zum ${falligkeitsdatum}. Der empfohlene Betrag ist 2 GB für mindestens 180 PKR. \n\nDas wäre alles.\nMit fruendlichen Grüßen,\nZeug App`);

    sheet.getRange("B32").setValue("Ja");

  }
  else
  {
    sheet.getRange("B32").setValue("Nein");

  }
  sheet.getRange("C32").setValue(heute);

}

function resetHandy(sheet)
{
  //Update the phone bill to 7 days from now.
  const HANDY_ABBON_TAGE = sheet.getRange("E32").getValue() - 1; //-1 because 23 hours 59 minutes is added later
  var falligkeitsdatum = new Date();
  sheet.getRange("C32").setValue(falligkeitsdatum); //Set last updated to today

  falligkeitsdatum.setHours(23, 59, 59, 0)//This is added to align with the convention used in the phone app
  falligkeitsdatum.setDate(falligkeitsdatum.getDate() + HANDY_ABBON_TAGE);
  sheet.getRange("D32").setValue(falligkeitsdatum); //Set due date
  sheet.getRange("B32").setValue("Nein");
  //Logger.log(falligkeitsdatum);


}

function doPost(e) 
{
  // Parse incoming JSON body
  //const data = JSON.parse(e.postData.contents || '{}');
  //const num = parseInt(data.number, 10);

  var valueString = e.parameter.value;
  var num = Number(valueString);

  const ss = getCurrentSpreadSheet();
  const sheet = getMainSheet();

  if (!isNaN(num)) {
    
    var cellB7 = sheet.getRange("B7");
    var valueB7 = cellB7.getValue();
    var cellB9 = sheet.getRange("B9");
    var valueB9 = cellB9.getValue();

    if (num === 1 || num === 3)
    {
    var value = -1;
    if (valueB7 === 1) {
      value = 2;
    } else if (valueB7 === 2) {
      value = 1;
    }

    cellB7.setValue(value);
    const DEHNUNGS_INDEX = 1;
    updateHistory(getSheetNames()[DEHNUNGS_INDEX][0], valueB7);
    sheet.getRange("C7").setValue(new Date());
    }

    if (num === 1 || num === 2)
    {
    var exercises = ["Bizeps und Rücken", "Trizeps und Shulter", "Beine"];
    
    // Check the value of B7 and toggle between 1 and 2
    var value = -1; //1 = bic, 2 = tri, 3 = beine
    if (valueB9 === exercises[0]) {
      value = 2;
    } else if (valueB9 === exercises[1]) {
      value = 3;
    } else if (valueB9 === exercises[2]) {
      value = 1;
    }
    
    cellB9.setValue(exercises[value - 1]);

    const UBUNGS_INDEX = 2;
    updateHistory(getSheetNames()[UBUNGS_INDEX][0], exercises.indexOf(valueB9) + 1);
    sheet.getRange("C9").setValue(new Date());
    }
    if (num === 4)
    {
      var valueB17 = sheet.getRange("B17").getValue();
      var valueB19 = sheet.getRange("B19").getValue();
      var valueB24 = sheet.getRange("B24").getValue();
      var valueB29 = sheet.getRange("B29").getValue();
      var valueB32 = sheet.getRange("B32").getValue();

      var heute = new Date();
      //Query and return response with data from the sheet
      createUpdateEmail(sheet, `Zeug Abfrage erfolgreich: ${heute}`);
      return ContentService
      .createTextOutput(JSON.stringify({ status: `Abfrage erfolgreich: ${heute}`, nachste_dehnung: valueB7, nachste_ubung: valueB9, haarwaschmittel: valueB17, haarol: valueB19, autoriefen: valueB24, dateisicherung: valueB29}))
      .setMimeType(ContentService.MimeType.JSON);
    }
    if (num === 5)
    {
      //Update the phone bill to 7 days from now.
      resetHandy(sheet);


    }
  // Return a JSON response
  createUpdateEmail(sheet, `Zeug Aktualisiert: ${num}`);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Aktualisiert', erhalten: num }))
    .setMimeType(ContentService.MimeType.JSON);
}
  else 
  {
      sendEmailUpdate(`Zeug Nicht Aktualisiert`, `Fehler. Erhalten: ${num}`);

    return ContentService
    .createTextOutput(JSON.stringify({ status: 'Fehler', erhalten: num }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
