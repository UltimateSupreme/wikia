(function (LockForums) {
    "use strict";
    jQuery(function ($) {
 
        // set up default config options if custom ones haven't been supplied
        // want to ensure variables have the right type, so not using $.extend here
        if (!$.isPlainObject(LockForums)) {
            LockForums = {};
        }
        if (typeof LockForums.expiryDays !== "number") {
            LockForums.expiryDays = 30;
        }
        if (typeof LockForums.expiryMessage !== "string") {
            LockForums.expiryMessage = "This forum hasn\'t been commented on for over <expiryDays> days. There is no need to reply.";
        }
        // Adding support to optionally ignore dates of deleted replies
        if (typeof LockForums.ignoreDeletes !== "boolean") {
            LockForums.ignoreDeletes = false;
        }
        // Adding support for optional warnings
        if (typeof LockForums.warningDays !== "number") {
            // Warnings disabled if warningDays is zero
            LockForums.warningDays = 0;
        }
        if (typeof LockForums.warningMessage !== "string") {
            LockForums.warningMessage = "This forum hasn\'t been commented on " +
                "for over <warningDays> days. Please reply ONLY if a " +
                "response is really needed.";
        }
        // Adding support for optional banners
        if (typeof LockForums.banners !== "boolean") {
            LockForums.banners = false;
        }
        if (typeof LockForums.expiryBannerMessage !== "string") {
            LockForums.expiryBannerMessage = "<span style=\"color: maroon; " +
                "font-weight: bold;\">Note:</span> This topic has been " +
                "unedited for <actualDays> days. It is considered " +
                "<b>archived</b> - the discussion is over. If you feel this " +
                "forum needs additional information, contact an administrator.";
        }
        // Specify 'stylesheet' if you want to use local CSS, otherwise
        // define any overrides with "{'tag1': 'value1', 'tag2': 'value2'}", etc.
        // Note that specifying 'stylesheet' will not apply any styling at all
        // to the banner.
        if (typeof LockForums.expiryBannerStyle !== "object" &&
            LockForums.expiryBannerStyle !== 'stylesheet') {
            LockForums.expiryBannerStyle = {};
        }
        if (typeof LockForums.warningBannerMessage !== "string") {
            LockForums.warningBannerMessage = "<span style=\"color: maroon; " +
                "font-weight: bold;\">Note:</span> This topic has been " +
                "unedited for <actualDays> days. It is considered " +
                "<b>archived</b> - the discussion is over. Do not add to " +
                "unless it really <i>needs</i> a response.";
        }
        // Specify 'stylesheet' if you want to use local CSS, otherwise
        // define any overrides with "{'tag1': 'value1', 'tag2': 'value2'}", etc.
        // Note that specifying 'stylesheet' will not apply any styling at all
        // to the banner.
        if (typeof LockForums.warningBannerStyle !== "object" &&
            LockForums.warningBannerStyle !== 'stylesheet') {
            LockForums.warningBannerStyle = {};
        }
        // Adding support for optional popup on warning
        if (typeof LockForums.warningPopup !== "boolean") {
            LockForums.warningPopup = false;
        }
        if (typeof LockForums.warningPopupMessage !== "string") {
            LockForums.warningPopupMessage = "This forum has not had a response " +
                "for over <actualDays> days; are you sure you want to reply?";
        }
        if (typeof LockForums.forumName !== "string") {
            LockForums.forumName = "Forum";
        }
        // Adding support for configurable box height to accommodate longer messages
        if (typeof LockForums.boxHeight !== "number") {
            LockForums.boxHeight = 50;
        }
 
        if (
            mediaWiki.config.get('wgNamespaceNumber') !== 1201 || // Threads
            $(".BreadCrumbs a:first").text() !== LockForums.forumName // Forums only
        )
            return;
 
        // Get the last comment date
        var expiryMilliseconds = LockForums.expiryDays * 24 * 60 * 60 * 1000,
            warningMilliseconds = LockForums.warningDays * 24 * 60 * 60 * 1000,
            then = $('ul.comments li.SpeechBubble .permalink').last().text().split(/,(.+)/),
            replies = $('ul.comments li.SpeechBubble'),
            oldDate,
            currentDate = new Date(),
            diffMilliseconds,
            diffDays,
            expired,
            warning;
 
        // If desired, ignore deleted replies when calculating oldDate
        if (LockForums.ignoreDeletes) {
            var i = replies.length - 1;
 
            while (i > 0 && ($(replies[i]).hasClass('new-reply') ||
                replies[i].getElementsByClassName('speech-bubble-message-removed').length > 0))
                i --;
 
            then = $(replies[i].getElementsByClassName('permalink')).last().text().split(/,(.+)/);
        }
 
        // Small trick by MGeffro
        if (then.length === 1) {
            then = then[0];
        } else {
            then = then[1];
        }
 
        oldDate = new Date(then.trim());
        diffMilliseconds = currentDate.getTime() - oldDate.getTime();
        diffDays = Math.floor(diffMilliseconds / 1000 / 60 / 60 / 24);
        expired = diffMilliseconds > expiryMilliseconds;
        warning = (!expired && warningMilliseconds > 0 &&
            diffMilliseconds > warningMilliseconds);
 
        // dynamically replace <expiryDays> with the value of LockForums.expiryDays
        // also allow the use of <actualDays> to show actual age in days
        LockForums.expiryMessage = LockForums.expiryMessage.replace(/<expiryDays>/g, LockForums.expiryDays).replace(/<actualDays>/g, diffDays);
        LockForums.expiryBannerMessage = LockForums.expiryBannerMessage.replace(/<expiryDays>/g, LockForums.expiryDays).replace(/<actualDays>/g, diffDays);
 
        // dynamically replace <warningDays> with the value of LockForums.warningDays
        // also allow the use of <actualDays> to show actual age in days
        LockForums.warningMessage = LockForums.warningMessage.replace(/<warningDays>/g, LockForums.warningDays).replace(/<actualDays>/g, diffDays).replace(/<expiryDays>/g, LockForums.expiryDays);
        LockForums.warningBannerMessage = LockForums.warningBannerMessage.replace(/<warningDays>/g, LockForums.warningDays).replace(/<actualDays>/g, diffDays);
        LockForums.warningPopupMessage = LockForums.warningPopupMessage.replace(/<warningDays>/g, LockForums.warningDays).replace(/<actualDays>/g, diffDays);
 
        // lock commenting if expired
        if (expired) {
            $('textarea.replyBody')
                .attr({
                    placeholder: LockForums.expiryMessage,
                    disabled: 'disabled'
                })
                .height(LockForums.boxHeight);
        }
        // we haven't locked yet but we want to warn people that it is old
        else if (warning) {
            $('textarea.replyBody')
                .attr({
                    placeholder: LockForums.warningMessage
                })
                .height(LockForums.boxHeight);
 
            // If we've enabled warnings, intercept the events on the
            // reply button and add a confirmation dialog
            if (LockForums.warningPopup) {
               $('.replyButton').on('click', function(event) {
                   if (!confirm(LockForums.warningPopupMessage))
                      event.stopPropagation();
               });
            }
        }
 
        // If we've enabled banners and we need one, put one on the page
        if ((expired || warning) && LockForums.banners) {
            var message = (expired ? LockForums.expiryBannerMessage :
                LockForums.warningBannerMessage);
            var styles  = (expired ? LockForums.expiryBannerStyle :
                LockForums.warningBannerStyle);
            var mainMsg = $('.SpeechBubble.message-main').get(0);
            var banner  = document.createElement('div');
 
            banner.id        = 'forum-warning-banner';
            banner.className = 'warning-banner-' + (expired ? 'expired' : 'warning');
            banner.innerHTML = message;
 
            // apply some default styling unless 'stylesheet' is specified,
            // which will allow the wiki to define styles in their local CSS
            if (styles !== 'stylesheet') {
                $(banner).css({
                   'border':           '2px solid #f66',
                   'background-color': 'whitesmoke',
                   'margin':           '0.8em 0px',
                   'padding':          '0.5em 12px',
                   'color':            'black',
                });
 
                // apply any user-specified CSS as well
                $(banner).css(styles);
            }
 
            mainMsg.parentNode.insertBefore(banner, mainMsg);
        }
 
        // expose public interface
        window.LockForums = LockForums;
    });
}(window.LockForums));
