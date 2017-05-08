<?php
	
	$url = $_GET['url'];
	$method = $_GET['method'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$url);
	if($method == "POST"){
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, null);
	}
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$headers = [
		"Content-Type:application/json",
		"X-API-KEY:A4p8i6yzZXcE5xjclAUFlGGglbmsIGzk"
	];

	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	$server_output = curl_exec ($ch);

	echo $server_output;

?>