# Contact Form Setup Guide (Google Sheets)

This guide will help you set up the contact form to save submissions to a Google Sheet.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ New Spreadsheet**
3. Name it "Portfolio Submissions"
4. In cell A1, add these headers:
   - A1: `Name`
   - B1: `Email`
   - C1: `Subject`
   - D1: `Message`
   - E1: `Date`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. A new tab will open with the editor
3. Delete all the default code
4. Paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the form data
    const data = e.parameter;
    
    // Add data to the sheet
    sheet.appendRow([
      data.name,
      data.email,
      data.subject,
      data.message,
      new Date()
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Message received! Thank you for contacting me."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Error: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Click **Save** (icon in top left)
6. Name the project something like "Portfolio Contact Form"

## Step 3: Deploy the Script

1. Click **Deploy** (blue button in top right)
2. Click **New deployment**
3. In the dropdown, select **Web app**
4. Set the following:
   - Execute as: **Your email address**
   - New users can access: **Anyone**
5. Click **Deploy**
6. You'll see a dialog with a URL - **Copy this entire URL**

## Step 4: Add URL to Your Website

1. Open `/mail/contact.js` in your code editor
2. Find this line (near the top):
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercopy";
   ```
3. Replace the URL with the one you copied in Step 3
4. Save the file

## Step 5: Test It!

1. Open your portfolio website
2. Go to the Contact section
3. Fill out the form and submit
4. You should see "Message Sent!" message
5. Check your Google Sheet - the submission should appear as a new row!

## Troubleshooting

### "Failed to send message" error
- Make sure you copied the correct deployment URL
- Check that the URL ends with `/usercopy`
- The URL should look like: `https://script.google.com/macros/d/1ABC...xyz/usercopy`

### Can't find Apps Script
- In Google Sheets, go to **Extensions** → **Apps Script** (not "Add-ons")

### Submissions not appearing
- Make sure your sheet has the headers in the first row
- Check that column A is "Name", B is "Email", etc.

## To Update the Script Later

If you need to modify the Apps Script:
1. Go to your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Make your changes
4. Click **Deploy** → **Manage Deployments**
5. Click the edit icon next to your deployment
6. Update the new version in the Version dropdown
7. Click **Deploy**

That's it! Your contact form is now connected to Google Sheets! 🎉
