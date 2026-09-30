_McSkidy is imprisoned in King Malhare's Quantum Warren. Sir BreachBlocker III was put in charge of securing the fortress and implemented several access controls to prevent any escape. His defenses are worthy of his name._

_However, McSkidy managed to send vital clues to his team using harmless bunny pictures. One message revealed that five locks needed to be disabled to secure an escape route. The locks can be broken by examining their logic and leveraging the system's built-in chat for the guards. They can be eluded in revealing vital details or even passwords. However, you will need to speak their language._

## Learning Objectives

- Introduction to encoding/decoding
- Learn how to use CyberChef
- Identify useful information in web applications through HTTP headers

---
### Important Concepts
## Encoding and Decoding

Encoding is a method to transform data to ensure compatibility between different systems. It differs from encryption in purpose and process.

||Encoding|Encryption|
|---|---|---|
|**Purpose**|Compatibility  <br>Usability|Security  <br>Confidentiality|
|**Process**|Standardized|Algorithm + Key|
|**Security**|No|Yes|
|**Speed**|Fast|Slow|
|**Examples**|Base64|TLS|

Decoding is the process of converting encoded data back to its original, readable, and usable form.

## CyberChef Overview

[CyberChef](https://cyberchef.io/) is also known as the Cyber Swiss Army Knife. Ready to cook some recipes?

|Area|Description|
|---|---|
|Operations|Repository of diverse CyberChef capabilities|
|Recipe|Fine-tune and chain the operations area|
|Input|Here you provide the input for your recipe|
|Output|Here is the output of your recipe|

## Simple Example

Try your first recipe:

- Open either the online [CyberChef](https://cyberchef.io/) version in your regular browser, or use the offline CyberChef version available in the bookmarks section of the AttackBox. Drag and drop the `To Base64` operation from the **Operations** area on the left side to the **Recipe** area in the center, and add `IamRoot` into the **Input** area.

- Add another operation, `From Base64`, to show the initial input again, showcasing chain operations.

**Note:** You can enable/disable an operation in the recipe by toggling the middle button on the right of the operation.

![Cyberchef simple example of how to encode an input in Base64.](https://tryhackme-images.s3.amazonaws.com/user-uploads/68baea2454c82afe90fd7020/room-content/68baea2454c82afe90fd7020-1762941123967.png)

Congratulations! You took the first steps to become a master Chef.

## Inspecting Web Pages

Besides the rendered content of a web page, your browser usually receives and can show additional information.

For this challenge, you will get the chance to have a deeper look at that information and put it to good use.

To do this, depending on your browser, you can access the functionality as shown below:

|Browser|Menu path|
|---|---|
|Chrome|`More tools` > `Developer tools`|
|Firefox|`Menu` (☰) > `More tools` > `Web Developer Tools`|
|Microsoft Edge|`Settings and more (...)` > `More tools` > `Developer tools`|
|Opera|`Developer` > `Developer tools`|
|Safari|`Develop` > `Show Web Inspector` (Requires enabling the "Develop" menu in `Preferences` > `Advanced`)|

> **Note:** For a better experience, you can reposition the console on the right side of the browser. Look for the three dots on the right side of the console.
> 
> ![Docking Firefox console to the Right](https://tryhackme-images.s3.amazonaws.com/user-uploads/68baea2454c82afe90fd7020/room-content/68baea2454c82afe90fd7020-1762941124118.png)
