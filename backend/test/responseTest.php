<?php
require_once __DIR__ . '/../helpers/response.php';

//test success with extra details
sendSuccess("User registered successfully", ["user_id" => 123], 201);

// Test error with extra details
sendError("Validation failed", 422, ["fields" => ["email" => "Invalid email address"]]);

