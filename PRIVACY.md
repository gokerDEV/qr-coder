# Privacy

> To facilitate the compliance of your extension with the Chrome Web Store Developer Program Policies, you are required to provide the information listed below. The information provided in this form will be shared with the Chrome Web Store team. Please ensure that the information provided is accurate, as it will improve the review time of your extension and decrease the risk of this version being rejected.

---

## Single purpose
> An extension must have a single purpose that is narrow and easy-to-understand.

QR Coder has one narrow purpose: to generate customizable QR codes from user input or the currently active webpage URL locally on the device.

---

## Permission justification

> A permission is either one of a list of known strings, such as "activeTab", or a match pattern giving access to one or more hosts.
Remove any permission that is not needed to fulfill the single purpose of your extension. Requesting an unnecessary permission will result in this version being rejected.

### activeTab Justification

QR Coder uses the `activeTab` permission only when the user explicitly opens the extension to generate a QR code for the current webpage. It temporarily accesses the active page's URL to automatically pre-fill the QR code data. Access is limited to the active tab, lasts only for the user-initiated action, and no page data is transmitted off-device.

### storage Justification

QR Coder uses the `storage` permission to save user preferences, settings, and configuration for QR code generation locally. Data is stored in `chrome.storage.local` on the user's device, can be cleared at any time via Chrome's extension data controls, and is never transmitted to external servers or shared with third parties.

### downloads Justification

QR Coder uses the `downloads` permission only when the user chooses to save or export the generated QR code image (e.g., as PNG or SVG) to their device. This enables a user-initiated file download. QR Coder does not download files automatically, does not upload or transmit report data anywhere, and the exported file is created locally.

## Are we using remote code?

> Remote code is any JS or Wasm that is not included in the extension's package. This includes references to external files in <script> tags, modules pointing to external files, and strings evaluated through eval()

No, we are not using remote code.


## User Data

> Does your extension collect or transmit any user data?

No, we do not collect or transmit any user data.

### We certify that the following disclosures are true:

* We do not sell or transfer user data to third parties, outside of the approved use cases
* We do not use or transfer user data for purposes that are unrelated to my item's single purpose
* We do not use or transfer user data to determine creditworthiness or for lending purposes
