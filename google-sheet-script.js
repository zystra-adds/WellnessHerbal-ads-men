/**
 * ===============================================================
 * WELLNESS HERBAL - GOOGLE APPS SCRIPT WEB APP FOR GOOGLE SHEETS
 * ===============================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename your spreadsheet (e.g. "Wellness Herbal - Orders")
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire code
 * 5. Click "Save" (Floppy disk icon)
 * 6. Click "Deploy" (top-right blue button) > "New deployment"
 * 7. Click gear icon next to "Select type" > choose "Web app"
 * 8. Set settings:
 *    - Description: "Wellness Herbal Orders API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (VERY IMPORTANT!)
 * 9. Click "Deploy" > "Authorize access" > Choose your Google account > Advanced > Go to Untitled (unsafe) > Allow
 * 10. Copy the "Web app URL" (ends with /exec) and share it here!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Order ID",
        "Customer Name",
        "Mobile Number",
        "Pincode",
        "Delivery Address",
        "Product",
        "Amount",
        "Status"
      ]);
      
      // Style headers
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground("#064e3b");
      headerRange.setFontColor("#fef08a");
      headerRange.setFontWeight("bold");
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timestamp = data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var orderId = data.orderId || "";
    var name = data.name || "";
    var phone = data.phone ? "'" + data.phone : ""; // Leading quote keeps full phone string
    var pincode = data.pincode ? "'" + data.pincode : "";
    var address = data.address || "";
    var product = data.product || "Complete Power Combo (Testosterone Powder 200g + Steel Man Gold 30 Capsules + Oil Spray 50ml)";
    var amount = data.amount || "₹3,499 (COD)";
    var status = "New Order (Pending Confirmation)";

    // Append the row
    sheet.appendRow([
      timestamp,
      orderId,
      name,
      phone,
      pincode,
      address,
      product,
      amount,
      status
    ]);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order recorded successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Wellness Herbal Orders Webhook is Active!");
}
