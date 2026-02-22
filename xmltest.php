<?php
require("settings.php");


header('Content-Type: text/xml');
header('Cache-Control: no-cache');
header('Pragma: no-cache');
echo '<?xml version="1.0"?>';
echo '<response>';

$elrezu='unknown error';
@$con=mysqli_connect($db_host,$db_username,$db_password);
$sql="SHOW FULL PROCESSLIST";
$countemz=0;
$rows=array();
if (@$result=mysqli_query($con,$sql))
{
	$elrezu='ok';
	while($row = mysqli_fetch_array($result))
	{
		$countemz++;
		$rows[]=$row;
	}
}
else
{$elrezu='DB error';}


echo '<howmanyinprocesslist>'.$countemz.'</howmanyinprocesslist>';
echo '<result>'.$elrezu.'</result>';

if($countemz > $max_items_in_processlist && $max_items_in_processlist != 0)
{
	echo '<processlist>';
	foreach($rows as $r)
	{
		echo '<process>';
		echo '<pid>'.htmlspecialchars($r['Id'] ?? '').'</pid>';
		echo '<user>'.htmlspecialchars($r['User'] ?? '').'</user>';
		echo '<host>'.htmlspecialchars($r['Host'] ?? '').'</host>';
		echo '<db>'.htmlspecialchars($r['db'] ?? '').'</db>';
		echo '<command>'.htmlspecialchars($r['Command'] ?? '').'</command>';
		echo '<time>'.htmlspecialchars($r['Time'] ?? '').'</time>';
		echo '<state>'.htmlspecialchars($r['State'] ?? '').'</state>';
		echo '<info>'.htmlspecialchars($r['Info'] ?? '').'</info>';
		echo '</process>';
	}
	echo '</processlist>';
}
echo '</response>';

?>