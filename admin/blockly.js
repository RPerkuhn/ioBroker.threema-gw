'use strict';

goog.provide('Blockly.JavaScript.Sendto');

goog.require('Blockly.JavaScript');

// --- SendTo threema-gw --------------------------------------------------
Blockly.Words['threema-gw']               = {'en': 'threema-gw',                       'de': 'threema-gw',                              'ru': 'threema-gw'};
Blockly.Words['threema-gw_text']          = {'en': 'text',                        'de': 'Text',                               'ru': '?????????'};

Blockly.Words['threema-gw_log']           = {'en': 'log level',                   'de': 'Loglevel',                           'ru': '????????'};
Blockly.Words['threema-gw_log_none']      = {'en': 'none',                        'de': 'keins',                              'ru': '???'};
Blockly.Words['threema-gw_log_info']      = {'en': 'info',                        'de': 'info',                               'ru': '????'};
Blockly.Words['threema-gw_log_debug']     = {'en': 'debug',                       'de': 'debug',                              'ru': 'debug'};
Blockly.Words['threema-gw_log_warn']      = {'en': 'warning',                     'de': 'warning',                            'ru': 'warning'};
Blockly.Words['threema-gw_log_error']     = {'en': 'error',                       'de': 'error',                              'ru': '??????'};

Blockly.Words['threema-gw_anyInstance']   = {'en': 'all instances',               'de': 'Alle Instanzen',                     'ru': '?? ??? ????????'};
Blockly.Words['threema-gw_tooltip']       = {'en': 'Send a threema message via threema gateway',               'de': 'Sende ein E-Mail',                   'ru': '??????? threema-gw'};
Blockly.Words['threema-gw_help']          = {'en': 'https://github.com/ioBroker/ioBroker.threema-gw/blob/master/README.md', 'de': 'https://github.com/ioBroker/ioBroker.threema-gw/blob/master/README.md', 'ru': 'https://github.com/ioBroker/ioBroker.threema-gw/blob/master/README.md'};

Blockly.Sendto.blocks['threema-gw'] =
    '<block type="threema-gw">'
    + '     <value name="INSTANCE">'
    + '     </value>'
    + '     <value name="TEXT">'
    + '         <shadow type="text">'
    + '             <field name="TEXT_TEXT">text</field>'
    + '         </shadow>'
    + '     </value>'
    + '     <value name="LOG">'
    + '     </value>'
    + '</block>';

Blockly.Blocks['threema-gw'] = {
    init: function() {
        var options = [[Blockly.Words['threema-gw_anyInstance'][systemLang], '']];
        if (typeof main !== 'undefined' && main.instances) {
            for (var i = 0; i < main.instances.length; i++) {
                var m = main.instances[i].match(/^system.adapter.threema-gw.(\d+)$/);
                if (m) {
                    var k = parseInt(m[1], 10);
                    options.push(['threema-gw.' + k, '.' + k]);
                }
            }
            if (options.length === 0) {
                for (var u = 0; u <= 4; u++) {
                    options.push(['threema-gw.' + u, '.' + u]);
                }
            }
        } else {
            for (var n = 0; n <= 4; n++) {
                options.push(['threema-gw.' + n, '.' + n]);
            }
        }

        this.appendDummyInput('INSTANCE')
            .appendField(Blockly.Words['threema-gw'][systemLang])
            .appendField(new Blockly.FieldDropdown(options), 'INSTANCE');
	
        this.appendValueInput('TEXT')
            .setCheck('String')
            .appendField(Blockly.Words['threema-gw_text'][systemLang]);

        this.appendDummyInput('LOG')
            .appendField(Blockly.Words['threema-gw_log'][systemLang])
            .appendField(new Blockly.FieldDropdown([
                [Blockly.Words['threema-gw_log_none'][systemLang],  ''],
                [Blockly.Words['threema-gw_log_info'][systemLang],  'log'],
                [Blockly.Words['threema-gw_log_debug'][systemLang], 'debug'],
                [Blockly.Words['threema-gw_log_warn'][systemLang],  'warn'],
                [Blockly.Words['threema-gw_log_error'][systemLang], 'error']
            ]), 'LOG');

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Words['threema-gw_tooltip'][systemLang]);
        this.setHelpUrl(Blockly.Words['threema-gw_help'][systemLang]);
    }
};

Blockly.JavaScript['threema-gw'] = function(block) {
    var dropdown_instance = block.getFieldValue('INSTANCE');
    var logLevel = block.getFieldValue('LOG');
    var message  = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
 
    var text = message;
    
    var logText;

    if (logLevel) {
        logText = 'console.' + logLevel + '("threema-gw: " + ' + message + ');\n'
    } else {
        logText = '';
    }

    return "sendTo('threema-gw" + dropdown_instance + "', " + text + ");\n" + logText;
};
