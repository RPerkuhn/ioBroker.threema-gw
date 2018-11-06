![Logo](admin/threema-gw-whitebg.png)
# ioBroker.threema-gw
=================

This adapter is about to be a message sender for threema gateway.

As prerequesit you need a gateway account at threema. Unfortunately this is not free of charge. 
For prices have a look at https://gateway.threema.ch.

In this version of the Threema gateway adapter it can only support BASIC sending out of messages. No attachements and no returns are possible. For details you can visit https://gateway.threema.ch

If you decide to order a threema gateway account, you can choose a threema sender name (beginning with *) and after successful registration you'll get an API secret.

This API secret and the eight digit sender name has to be entered into the configuration page.
Also the eight digit receipient Threema-ID has to be entered there.
If you need more receipients you can activate further instances and configure them with different receipients.

Once configured you can send out alert- or info messages including emoticons and linebreaks ("\n")

##Usage

To send a threema-message from ScriptEngine just write:

// simple message using instance 0 of threema-gw
sendto("threema-gw.0","The battery in motion detector is low");

// message including emoticon, linebreak and special character using instance 0 of threema-gw
sendto("threema-gw.0","😊\nThe temperature outside is above 25℃");
