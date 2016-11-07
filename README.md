# psuedoletter
A chrome extension for writing a basic cover letter in your browser. The idea is to be able to jot down the layout for a cover letter while viewing a job posting online. The extension saves to local storage so you can close the extension, navigate to different sites, etc, and still come back and work on the letter. Once you're done, you can export your letter as a .doc.

About this version:
The extension's ultimate goal is to be completely customizable. Currently, this is not possible while running the extension.
To customize the preset text/form fields/text areas, you will have to alter the .js file. The patterns for writing these strings are very simple to mimic.

Notes on altering the preset page content:
Because of how the extension is currently written, a page with a textarea can't have any form fields, and vice versa.
Each page needs to have at least one form field or textarea.
Be sure to update the placeholder text array when adding a form field/textarea.
Also update letter.pages_total.

Issues: 
Need to add media queries for popup dimensions.
