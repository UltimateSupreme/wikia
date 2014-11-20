// Register the file with the magic words.
$wgExtensionMessagesFiles['ViewerNameMagic'] = dirname(__FILE__) . '/ViewerName.i18n.magic.php';
 
// Assign a value to our variable
$wgHooks['ParserGetVariableValueSwitch'][] = 'wfMyAssignAValue';
function wfMyAssignAValue( &$parser, &$cache, &$magicWordId, &$ret ) {
	if ( 'MAG_viewername' == $magicWordId ) {
		if ( $GLOBALS['wgUser']->isAnon() ) 
			$ret = 'Anon';
		else $ret = $GLOBALS['wgUser']->mName;
	}
	return true;
}
 
// Register the custom variable(s) so that it shows up in
// Special:Version under the listing of custom variables.
$wgExtensionCredits['variable'][] = array(
	'name' => 'ViewerName',
	'author' => '[http://dev.wikia.com/wiki/User:UltimateSupreme UltimateSupreme]',
	'version' => '1.0',
	'description' => 'Provides a magic word to display viewer\'s username',
	'url' => 'http://c.wikia.com',
);
 
// Register wiki markup words associated with
// MAG_NIFTYVAR as a variable and not some
// other type of magic word
$wgHooks['MagicWordwgVariableIDs'][] = 'wfMyDeclareVarIds';
function wfMyDeclareVarIds( &$customVariableIds ) {
 
	// $customVariableIds is where MediaWiki wants to store its list of custom
	// variable IDs. We oblige by adding ours:
	$customVariableIds[] = 'MAG_viewername';
 
	return true;
}
