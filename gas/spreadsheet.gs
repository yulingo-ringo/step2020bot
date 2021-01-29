function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SpreadsheetApp.getActiveSheet();
  var jsonString = e.postData.getDataAsString();
  var data = JSON.parse(jsonString);
  
  var userId = data.userId;
  var time = data.timestamp+32400000;
  var dateRow = Math.floor(time/86400000)-18521;
  var text = data.text;
  var temperature = text.split("℃");
  const peopleRange = sheet.getRange(3, 3, 35, 1);
  const peopleValues = peopleRange.getValues()
  var peopleArrayNumber;  
  
  for(let i=0; i<35; i++){
    if(String(peopleValues[i])===userId){
      peopleArrayNumber = i+3
    }   
  }
  
  const range = sheet.getRange(peopleArrayNumber,dateRow);
  if(text.match("℃")){
    range.setValue(temperature);
  }
}
