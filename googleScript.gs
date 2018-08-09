function searchHotels() {
  var sheet =  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var location = sheet.getRange("C2").getValue();
  var guests = sheet.getRange("C3").getValue();
  var checkin = sheet.getRange("C4").getValue();
  var checkout = sheet.getRange("C5").getValue();
     
  var queryString = "?location="+ location + "&guests=" + guests + "&checkin=" + checkin + "&checkout=" + checkout;
  
  var url = "https://wt-3457dd39a9a5d1e9c3bd001681315c5c-0.sandbox.auth0-extend.com/auth0" + queryString;
  Logger.log(url);
  
  var result = UrlFetchApp.fetch(url);
  
  if (result.getResponseCode() == 200) {
    
    var rows = JSON.parse(result.getContentText());
    Logger.log(rows);
    // getting our headers
    var heads = sheet.getRange("E2:H2").getValues()[0];
    var tr = rows.map (function (row) {
      return heads.map(function(cell){
        return row[cell] || "";
      });
    });
    
    // write result
    sheet.getRange(3, 5, tr.length, tr[0].length).setValues(tr);    
  }    
}

function clear(){
  var clear_range = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("E3:H23");
  clear_range.clearContent();
}
