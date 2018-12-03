![Logo](admin/threema-gw-whitebg.png)
# ioBroker.threema-gw
=================

Send threema messages using the threema gateway.

As prerequisite you need a gateway account at threema. Unfortunately this is not free of charge. 
For prices have a look at https://gateway.threema.ch.

In this version of the Threema gateway adapter it can only support BASIC sending out of messages. No attachements and no returns are possible. For details you can visit https://gateway.threema.ch

If you decide to order a threema gateway account, you can choose a threema sender name (beginning with *) and after successful registration you'll get an API secret.

This API secret and the eight digit sender name has to be entered into the configuration page.
Also the eight digit receipient Threema-ID has to be entered there.
If you need more receipients you can activate further instances and configure them with different receipients.

Once configured you can send out alert- or info messages including emoticons and linebreaks ("\n")

## Usage

To send a threema-message from ScriptEngine just write:

```javascript
// simple message using instance 0 of threema-gw
sendto('threema-gw.0','send','The battery in motion detector is low');

// message including emoticon, linebreak and special character using instance 0 of threema-gw
sendto('threema-gw.0','send','😊\nThe temperature outside is above 25℃');

```

## Changelog
### 0.1.3 (2018-11-08)
* (RPerkuhn) Minor improvements

### 0.1.2 (2018-11-08)
* (RPerkuhn) Support of linebreaks inside Blockly using \n

### 0.1.1 (2018-11-07)
* (RPerkuhn) Blockly integration for "Sendto" blocks

### 0.1.0 (2018-11-06)
* (RPerkuhn) first alpha release

## License

The MIT License (MIT)

Copyright (c) 2018 RPerkuhn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
