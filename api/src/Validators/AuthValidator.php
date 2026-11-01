<?php
namespace Virasat\Validators;

class AuthValidator {
    public static function validateLogin(array $data): array {
        $errors = [];

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email address is required.';
        }

        if (empty($data['password'])) {
            $errors['password'] = 'Password is required.';
        }

        return $errors;
    }
}
