jQuery(function ($) {
    'use strict';
    if ($('.ca-skins-switch').length) {
        return;
    }
    var elem = mw.html,
        monobook = window.monoBookText || 'Monobook',
        oasis = window.oasisText || 'Oasis',
        mobile = window.mobileText || 'Mobile',
        qstring = (window.location.search) ? '&' : '?';
 
    function skinlink(myskin, skintext) {
        return elem.element('li', {}, new elem.Raw(
        elem.element('a', {
            href: (window.location.href).replace(/#.*/, '') + qstring + $.param({useskin: myskin}),
            title: 'See this page in ' + myskin + ' skin',
            'class': 'ca-skins-switch'
        }, skintext)));
    }
 
    var $monobook = skinlink('monobook', monobook),
        $oasis = skinlink('oasis', oasis),
        $mobile = skinlink('wikiamobile', mobile);
 
    if (mw.config.get('skin') === 'oasis') {
        $(window.WikiaBar.wikiaBarWrapperObj.find('.tools')).append($monobook, $mobile);
    } else {
        $('#p-cactions > .pBody > ul').append($oasis, $mobile);
    }
});
