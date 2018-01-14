<?php

return [
    'production' => [
        'host' => env('AWS_LAMBDA_LOCAL_HOST', 'localhost'),
        'port' => env('AWS_LAMBDA_LOCAL_PORT', 3000),
    ],
    'local' => [
        'host' => env('AWS_LAMBDA_HOST', 'place-url-here'),
        'port' => env('AWS_LAMBDA_PORT', 443),
    ]
];