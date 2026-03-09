<?php
//server ID
$serverID=1; //if you have many servers change this number to give each server a different number (from 0 to 9)


//monitoring database connection:
//should be able to read all the processlist from all database
//but not need to have write permissions on the database
$test_DB=1; //0 database is not tested, 1 database is tested. make sure you set this to 1 if you want the tester to test the database too!
$db_host='localhost';
$db_username='chipmunk_monitor';
$db_password='asdfasfasfaf';
$max_items_in_processlist=40; //if you use the version that tests the DB, you will be warned (but the alarm wont ring) if there is more than max_items_in_processlist queries in your database, set to 0 to disable this
$alarm_after_how_many_bad_connections=20; //how many times must the test fail before the alarm starts


define('URL_BASE','/'); //the base URL of the tester, change it if you put the tester in a different location

