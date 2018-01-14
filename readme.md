### API's

This package is made for API's.

It can take your Laravel API application and make it fully scalable, with the power of lambdas. 
All you need to do is add install the package via composer
```
composer require
```

### Non-API

If you are using this package for a non-api's, where you eg. supply css files and js files, the recommendation is to 
store these files at a file storage, like S3 for better speed and not paying for an invocation to the lambda, when the 
file is static.


Cache

```
'aws-lambda' => [
        'driver' => 'file',
        'path' => '/tmp/laravel/framework/cache/data',
    ],
```

FILESYSTEMS
```
'awsLambda' => [
            'driver' => 'local',
            'root' => '/tmp/laravel/filesystem',
        ],
```


.ENV

```
CACHE_DRIVER=awsLambda
APP_LOG=syslog
FILESYSTEM_DRIVER=awsLambda
SESSION_DRIVER=array
```


SESSION

```
'files' => '/tmp/laravel/framework/sessions',
```


VIEW

Removed realpath` as path is first created after configs are loaded.
```
'compiled' => '/tmp/laravel/framework/views',
```
