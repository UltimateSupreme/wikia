if (({edit: 1, editredlink: 1, submit: 1})[mediaWiki.config.get('wgAction')] === 1) { // Edit pages only
    if ((/\.(?:js|css)$/i).test(mw.config.get('wgPageName'))) {
        jQuery(function ($) {
            'use strict';
            var $box;
            if (mw.config.get('skin') === 'oasis') {
                $box = $('textarea.cke_source'); // CKE Source mode
            }
            if (!$box || !$box.length) {
                $box = $('#wpTextbox1'); // Monobook Editing / Oasis Raw Source mode
            }
 
            $box.keydown(function (e) {
                if (e.keyCode === 9) {
 
                    // get caret position/selection
                    var start = this.selectionStart,
                        end = this.selectionEnd,
                        $this = $(this),
                        value = $this.val();
 
                    // text before caret + tab + text after caret
                    $this.val(value.substring(0, start) + "\t" + value.substring(end));
 
                    // put caret at right position again (add one for the tab)
                    this.selectionStart = this.selectionEnd = start + 1;
 
                    // prevent the focus lose
                    e.preventDefault();
                }
            });
        });
    }
}
