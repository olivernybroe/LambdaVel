<?php


namespace Uruloke\Lambdavel;


use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpFoundation\ServerBag;

class LambdaServiceProvider extends ServiceProvider
{
    public function boot() {
        $this->publishes([
            __DIR__.'/template.yml' => base_path('template.yml'),
        ]);

        $this->publishes([
            __DIR__.'/config.php' => config_path('lambda.php'),
        ]);
    }

    public function register()
    {
        /** @var ServerBag $server */
        $server = app('request')->server;

        // Running in lambda
        if($server->get('AWS_LAMBDA', false)) {
            // Create directory for generating views.
            File::makeDirectory('/tmp/laravel/framework/views', 0777, true);

            // Set url of application.
            if($server->get('AWS_SAM_LOCAL', false)) {
                $server->set('SERVER_NAME', config('lambda.local.host'));
                $server->set('SERVER_PORT', config('lambda.local.port'));
            }
            else {
                $server->set('SERVER_NAME', config('lambda.public.host'));
                $server->set('SERVER_PORT', config('lambda.public.port'));
            }

        }
    }
}