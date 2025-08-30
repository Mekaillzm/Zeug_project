# Zeug

A small app to track and update everyday activities.
Built on Google Apps Script and deployed as a Web App.


# Warning
Some text in the code and the sheet may be in German. Translations are provided in the setup instructions, which are entirely in English.
A translated example Google Sheet is also available as "Zeug (English Translation).xlsx"; however, the main code is built off of the German version. 
This does not impact anything, besides variable names and the Sheet names in the code.

The positions of cells in the Sheet are hard-coded into the code as shown by the example sheet. Changing these is not recommended, as it may cause the code to work differently than intended.



# Requirements
-Google Account, with working email
-A Google Sheet with the sheets, "Zeug", "Dehnungs-Historie" and "Übungshistorie" (translation: "Stuff", "Stretch-History" and "Exercise History")
-Apple Shortcuts on iOS or HTTP Shortcuts on Android

# Notes

A Routine, as used in this guide, represents a task carried out regularly.
Each Routine can be set to "Yes" or "No". 
Yes means that the action associated with the Routine should be carried out today, and vice versa.

For example, if the Phone-bill Routine is set to yes, then you will receive email reminders to pay this bill, until you update the bill status to "No".

Exceptions to this are the Exercise and Stretch Routines.
There are three Exercise Routines, "Biceps & Back", "Triceps & Shoulders" and "Legs", each describing which muscle group should be exercised in the next workout session.

There are two stretch routines, "1" and "2", each detailing two unique sets of stretches to be performed on alternating days.

# Setup Instructions

Run the code in a new Google Apps Script deployment. Deploy this as a web app, saving the deployment URL.

Create a Google Sheet using the template provided. Save the Sheet ID under the deployment information sheet, as well as the deployment URL. The version is optional.

Set the following event triggers:

1. Daily
  -Type: time-based trigger
  -Repeat: every day
  -function: dailyUpdate()
2. Hourly
  -Type: time-based trigger
   -Repeat: every hour
   -function: hourlyUpdate()
3. User Edit
   -Type: On Edit
   -function: onEdit()

Make sure to grant access permissions for your deployment.

Next, create an HTTP Shortcut or an Apple Shortcut.
In either app, create an http request that carries out a POST command. Use the copied deployment ID here.

You may use this to run a command to update or query the Google Sheet from your Android or iOS device.
The URL accepts a parameter called "value", numbering from 1-5.

For example:  https://www.google.com/url?q=https://script.google.com/macros/s/EXAMPLE_CODE/exec?value=1
Here the parameter "value" is set to 1, which will run the command detailed below.

The following commands can be run from your shortcut:
1. Update Exercise and Stretch
   -value: 1
   -Updates the current exercise routine and stretch routine, pulling the next ones.
   -This is useful in the event of both the exercise and stretch routines being completed. You can then update both at once. (e.g. "Biceps & Back" --> "Triceps & Shoulders " & (1 --> 2))
   -Example POST command: https://www.google.com/url?q=https://script.google.com/macros/s/EXAMPLE_CODE/exec&sa=D&source=editors&ust=1756586674052674&usg=AOvVaw3eJkYinc6kVAVsAHqfr6iS?value=1
2. Update Exercise
   -value: 2
   -Updates the current exercise routine, pulling the next one (e.g. "Biceps & Back" --> "Triceps & Shoulders ")
   -This is useful in the event of the exercise routine being completed. 
   -Example POST command: https://www.google.com/url?q=https://script.google.com/macros/s/EXAMPLE_CODE/exec&sa=D&source=editors&ust=1756586674052674&usg=AOvVaw3eJkYinc6kVAVsAHqfr6iS?value=2
3. Update Stretch
   -value: 3
   -Updates the current stretch routine, pulling the next one (e.g. 1 --> 2). 
   -This is useful in the event of the stretch routine being completed.
   -Example POST command: https://www.google.com/url?q=https://script.google.com/macros/s/EXAMPLE_CODE/exec&sa=D&source=editors&ust=1756586674052674&usg=AOvVaw3eJkYinc6kVAVsAHqfr6iS?value=3
4. Query Sheet
   -value: 4
   -Queries the Sheet for all current information, returning the queried data as a JSON object, while also sending an update email
   -Example POST command: https://www.google.com/url?q=https://script.google.com/macros/s/EXAMPLE_CODE/exec&sa=D&source=editors&ust=1756586674052674&usg=AOvVaw3eJkYinc6kVAVsAHqfr6iS?value=4
5. Update Phone Bill Due Date
   -value: 5
   -Updates the due date of the phone bill in the sheet according to the following algorithm:
      - Current Date + (Value in Cell E32 - 1 Day)
      - The time is always set to 11:59
      - Example: 
        Current day: 1 August
        Cell E32 shows 7 days to be the bill duration
        So, 1 August + (7 - 1 days) gives 7 August
        Final: 7 August, 11:59 pm
     - The reason for such an algorithm is to mirror the process used by the phone billing app
     - The status of the bill payment is set to "No" in cell B32
  

Set up your shortcut according to the commands above that you would like to use. Ensure the parameter "value" is set correctly. The code will not work if no value is provided.

# General Usage
Once set up, you may use the following features:

- Tap To Update: enter any text in the bordered field in the Zeug sheet. All of these lie in column A. This will update the adjacent cell in the B column according to the format highlighter below.
- POST command: you can run a command from any interface, as described above, to update or query the sheet.
- Daily updates: every day, the sheet will update automatically, using the parameters described below. You will also receive an email containing all updates.
- Hourly update: This is a special case for the phone bill, and alerts you repeatedly hours before the phone bill is due, as described below.

# Hard - Coded Features
Certain features have been hard-coded into the sheet, by cell location. They are detailed below. 
The "Row" describes the row within the main "Zeug" sheet of the particular feature. For example, "Next Exercise" is placed in row 9 and can be updated from A9.

Stretch Routine:
- Row: 7
- Swap values: 1 and 2
- This swaps between the two stretch routines, namely 1 and 2, whenever it is called from Tap To Update or a POST command with value = 3

Exercise Routine:
- Row: 9
- Swap values: "Biceps and Back", "Triceps and Shoulders", "Legs"
- This swaps between the three exercise routines, namely "Biceps and Back", "Triceps and Shoulders", "Legs", whenever it is called from Tap To Update the POST command with value = 2
- Example, "Biceps and Back" leads to "Triceps and Shoulder" when run. The order is set as above, with no variation. If the value in B9 is "Legs", it reverts to "Biceps and Back"

Exercise & Stretch:
- Row: 12
- Swap values: "Biceps and Back", "Triceps and Shoulders", "Legs" AND 1 and 2
- This swaps between the three exercise routines, and two stretch routines as detailed above, whenever it is called from Tap To Update or a POST command with value = 1
- Example, "Biceps and Back" in B9 leads to "Triceps and Shoulder" when run. At the same time, B7 will also be updated.
- The values in B7 and B9 are both updated simultaneously, but they are mutually exclusive.
  
Hair-wash Routine:
- Row: 17
- Swap values: "Yes" and "No" (or "Ja" and "Nein" in German)
- This swaps between the two boolean values, "Yes" and "No" whenever it is called from Tap To Update, or a daily update
  
Hair-oil Routine:
- Row: 17
- Swap values: "Yes" and "No" (or "Ja" and "Nein" in German)
- This swaps between the two boolean values, "Yes" and "No" whenever it is called from Tap To Update
- Daily update also affects this, setting it to "Yes" after the number of days set in D19 has elapsed (4 by default)
- For example, the value for Hair-oil will be "No" at first. Then, dailyUpdate() will query it every day, setting it to "Yes" permanently after 4 days, until you reset it to "No", by using the Tap To Update feature

Car Tyre Air Refill Routine:
- Row: 24
- Swap values: "Yes" and "No" (or "Ja" and "Nein" in German)
- This swaps between the two boolean values, "Yes" and "No" whenever it is called from Tap To Update
- Daily update also affects this, setting it to "Yes" after the number of days set in D24 has elapsed (14 by default)
- For example, the value will be "No" at first. Then, dailyUpdate() will query it every day, setting it to "Yes" permanently after 14 days, until you reset it to "No", by using the Tap To Update feature
  
 
Data Backup Routine:
- Row: 29
- Swap values: "Yes" and "No" (or "Ja" and "Nein" in German)
- This swaps between the two boolean values, "Yes" and "No" whenever it is called from Tap To Update
- Daily update also affects this, setting it to "Yes" after the number of days set in D29 has elapsed (6 by default)
- For example, the value will be "No" at first. Then, dailyUpdate() will query it every day, setting it to "Yes" permanently after 6 days, until you reset it to "No", by using the Tap To Update feature

Phone Bill Routine
- Row: 32
- Swap values: "Yes" and "No" (or "Ja" and "Nein" in German)
- This swaps between the two boolean values, "Yes" and "No" whenever it is called from Tap To Update
- Hourly update also affects this, setting it to "Yes" after the Billing Date in D32 is at less than 6 hours away. Once it is 6 hours away, you will receive an hourly email reminder as well.
- For example, the value will be "No" at first. Then,  hourlyUpdate() will query it every hour, setting it to "Yes" permanently when the billing date is 6 hours away, until you reset it to "No", by using the Tap To Update feature, or the POST command with value = 5
- The billing cycle duration can be configured in E32. Enter the number of days the phone package lasts here. The due date will be set to 11:59 PM on the final day.


# Logs
Logs for the exercise and stretch routine are also entered automatically.
The curretn routine and timestamp are stored.

The routines, alongside their designated numeric code are entered below. Note that these codes are arbitrary, but still hard-coded.

Routines:

1. Exercise:
   - Biceps & Back: 1
   - Tricepts & Shoulders: 2
   - Legs: 3
2: Stretch:
  - 1: 1
  - 2: 2



