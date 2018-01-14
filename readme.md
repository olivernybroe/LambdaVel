## SETUP

### API's

This package is made for API's.

It can take your Laravel API application and make it fully scalable, with the power of lambdas. 
All you need to do is add install the package via composer

```
composer require uruloke/lambdavel
```

And run 

```
php artisan vendor:publish
...
[x] Provider: Uruloke\Lambdavel\LambdaServiceProvider
...

```

Choose our package and there will then be added a file in your root directory called `template.yml`, which is AWS 
lambda's file for defining the endpoints.


### Configuration

Before first use, you need to setup your domain for Lambda in your config file `config/lambda.php`.
 


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

### PHP extensions

//TODO: not written yet.


### Non-API

If you are using this package for a non-api's, where you eg. supply css files and js files, the recommendation is to 
store these files at a file storage, like S3 for better speed and not paying for an invocation to the lambda, when the 
file is static.


## Running local

If you wan't to run AWS lambda locally, but have no prior experience with this, run

```
php artisan lambda:install
```

It will also prompt you to install the needed software for running the lambda's in local environment for testing. This
includes `SAM` and `Docker`.

For starting the local edition of lambda's just run

```
php artisan lambda:local
```

It wil automatically fire up `SAM local`, with the required parameters for our instance.



KEEP IN MIND LOCAL EDITION OF AWS LAMBDAS IS NOT COMPLETELY LIKE THE REAL VERSION.

You can for example experience `502 bad gateway`, because of too many concurrent calls.
 
