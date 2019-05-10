<?php

$curl = curl_init();

$qq = $_POST["qq"];
$msg = $_POST["msg"];
curl_setopt_array($curl, array(
  CURLOPT_PORT => "36524",
  CURLOPT_URL => "http://127.0.0.1:36524/api/v1/Cqp/CQ_sendGroupMsg",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\r\n\t\"群号\": $qq,\r\n\t\"msg\": \"$msg\"\r\n}",
  CURLOPT_HTTPHEADER => array(
    "Accept: */*",
    "Cache-Control: no-cache",
    "Connection: keep-alive",
    "Content-Type: application/json",
    "Host: 127.0.0.1:36524",
    "User-Agent: PostmanRuntime/7.11.0",
    "accept-encoding: gzip, deflate",
    "cache-control: no-cache",
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}