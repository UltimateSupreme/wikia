// Check to see if we are being called as an extension or directly
if ( !defined( 'MEDIAWIKI' ) ) {
   die( 'This file is an extension to MediaWiki and thus not a valid entry point.' );
}
 
// Magic words
$magicWords = array();
 
// English
$magicWords['en'] = array(
	// magic ID 'MAG_viewername' (1 means case-sensitive)
	'MAG_viewername' => array( 1, 'VIEWERNAME'),
);
