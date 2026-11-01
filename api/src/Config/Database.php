<?php
namespace Virasat\Config;

use PDO;
use Exception;

class Database {
    private static ?PDO $connection = null;

    public static function getConnection(): PDO {
        if (self::$connection !== null) {
            return self::$connection;
        }

        $host = Env::get('DB_HOST', '127.0.0.1');
        $port = Env::get('DB_PORT', '3306');
        $db   = Env::get('DB_DATABASE', 'virasat_atlas');
        $user = Env::get('DB_USERNAME', 'root');
        $pass = Env::get('DB_PASSWORD', '');
        $charset = 'utf8mb4';

        $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            self::$connection = new PDO($dsn, $user, $pass, $options);
            return self::$connection;
        } catch (Exception $e) {
            // Safe error handling without leaking password
            error_log('Database connection error: ' . $e->getMessage());
            throw new Exception('Database connection failed. Please ensure the database is running and configuration is correct.');
        }
    }
}

