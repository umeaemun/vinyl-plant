
# Google Sheets Setup Instructions

To connect the form to Google Sheets, follow these steps:

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Vinyl Pressing Plant Comparison"
3. Set up your header row with these columns:
   - Timestamp
   - Artist
   - Album
   - Quantity
   - Size
   - Type
   - Weight
   - Colour
   - Inner Sleeve
   - Jacket
   - Inserts
   - Shrink Wrap

## 2. Set up Google Apps Script

1. In your Google Sheet, go to Extensions > Apps Script
2. Replace the code in the editor with the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Add a timestamp
  var timestamp = new Date();
  
  // Add a new row with the form data
  sheet.appendRow([
    timestamp,
    data.artist || "",
    data.album || "",
    data.quantity || "",
    data.size || "",
    data.type || "",
    data.weight || "",
    data.colour || "",
    data.innerSleeve || "",
    data.jacket || "",
    data.inserts || "",
    data.shrinkWrap || ""
  ]);
  
  // Return success response
  return ContentService.createTextOutput(JSON.stringify({
    'success': true,
    'message': 'Data saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy the Web App

1. Click on "Deploy" > "New deployment"
2. Select "Web app" as the deployment type
3. Fill in the following:
   - Description: "Vinyl Form Data Collector"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the Web App URL that appears
6. Update the `GOOGLE_SHEET_WEBHOOK_URL` in the `src/utils/googleSheetsApi.ts` file with this URL

## 4. Test the Integration

1. Fill out the form on your website and submit it
2. Check your Google Sheet to see if the data was received correctly

## Note:
- The first time you test this, you may need to authorize the app to access your Google account
- If you make changes to the Google Apps Script, you'll need to create a new deployment for the changes to take effect
