<?php

header('Content-Type: text/javascript; charset=utf-8');

ob_start('ob_gzhandler');

// Fetch a random card.

// Output
echo 'hangman.init("card name lowercase", "clue (card type - card subtype)", "multiverseid integer w/o quotes");';

ob_end_flush();

?>