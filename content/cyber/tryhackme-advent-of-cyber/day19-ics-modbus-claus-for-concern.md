The snow falls heavily over Wareville as chaos erupts at TBFC headquarters. What should be the busiest shipping day of the season has turned into a disaster.

**"Another chocolate egg?!"** shouts a frustrated warehouse worker, holding up yet another Easter-themed package.**"We're supposed to be shipping Christmas presents!"**

The delivery drones buzz overhead, their mechanical hums sounding almost... mocking. Each one returns from its route empty, having successfully delivered its cargo. But the cargo is all wrong.

You're called into the command centre, where screens flicker with delivery statistics. Everything looks normal on the surface—1,000 presents in stock, 98% success rate, and all systems are operational. But the phones won't stop ringing with confused citizens asking why they're receiving chocolate eggs instead of the toys and gifts they ordered.

The logistics manager pulls up a delivery manifest. **"Look at this",** she says, pointing at the screen.**"The system indicates that we delivered a teddy bear to the Miller family, but they received a chocolate bunny instead. It's the same weight, exact dimensions, but completely different items."**

Then, on one of the monitoring screens, a message flashes for just a second before disappearing:

🐰 EGGSPLOIT v6.66 - Property of HopSec Island 🐰  
"Why should Christmas have all the fun?" - King Malhare

Someone has compromised the drone fleet's control systems. The attack is sophisticated, falsifying sensor data, manipulating inventory selection, and erasing all traces. This isn't just a prank—it's a calculated assault on Christmas itself.

Your mission is clear: investigate the TBFC Drone Delivery System, uncover how King Malhare's Eggsploit team has compromised it, and restore Christmas deliveries before SOC-mas is ruined.

**But be warned:** King Malhare doesn't leave systems undefended. Traps are waiting for the careless investigator. One wrong move and you might make things much worse.

## A Mysterious Discovery

As you walk through the warehouse control room, something catches your eye—a crumpled piece of paper on the floor near the PLC terminal. It looks like someone dropped it in a hurry.

You pick it up and unfold it. The handwriting is hurried, almost frantic:

TBFC DRONE CONTROL - REGISTER MAP
(For maintenance use only)

HOLDING REGISTERS:
HR0: Package Type Selection
     0 = Christmas Gifts
     1 = Chocolate Eggs
     2 = Easter Baskets

HR1: Delivery Zone (1-9 normal, 10 = ocean dump!)

HR4: System Signature/Version
     Default: 100
     Current: ??? (check this!)

COILS (Boolean Flags):
C10: Inventory Verification
     True = System checks actual stock
     False = Blind operation

C11: Protection/Override
     True = Changes locked/monitored
     False = Normal operation

C12: Emergency Dump Protocol
     True = DUMP ALL INVENTORY
     False = Normal

C13: Audit Logging
     True = All changes logged
     False = No logging

C14: Christmas Restored Flag
     (Auto-set when system correct)

C15: Self-Destruct Status
     (Auto-armed on breach)

CRITICAL: Never change HR0 while C11=True!
Will trigger countdown!

- Maintenance Tech, Dec 19
  

You stare at the note, confusion washing over you. _"Register map? Coils? What is all this?"_

The terminology is foreign—HR0, C11, "Modbus" scribbled in the margin. But something about it feels important, like a key you don't yet know how to use.

You pocket the note carefully. **"I'll figure out what this means later"**, you think. For now, you need to understand the systems you're dealing with.

_Little do you know, this crumpled note will be exactly what saves Christmas..._

## Learning Objectives

- How **SCADA (Supervisory Control and Data Acquisition)** systems monitor industrial processes
- What **PLCs (Programmable Logic Controllers)** do in automation
- How the **Modbus protocol** enables communication between industrial devices
- How to identify compromised system configurations in industrial systems
- Techniques for safely remediating compromised control systems
- Understanding protection mechanisms and trap logic in ICS environments

----
