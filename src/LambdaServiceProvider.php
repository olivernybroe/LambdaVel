<?php


namespace Uruloke\LambdaVel;


use Illuminate\Support\ServiceProvider;

class LambdaServiceProvider extends ServiceProvider
{
    public function boot() {
        $this->publishes([
            __DIR__.'/template.yml' => base_path('template.yml'),
        ]);
    }

    public function register() {
    }
}