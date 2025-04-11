<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code - DriveLine</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-header img {
            width: 120px;
        }
        .email-content {
            margin-bottom: 20px;
        }
        .otp-code {
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            background-color: #f0f9f4;
            padding: 10px 20px;
            border-radius: 5px;
        }
        .email-footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
        }
        .btn {
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #45a049;
        }

        .gradient-text {
            font-size: 3rem; /* For small screens */
            font-family: 'Georgia', serif;
            font-weight: 600;
            margin-bottom: 1rem;
            background-image: linear-gradient(to right, #1e3a8a, #6d28d9); /* Gradient: blue to purple */
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text; /* For Safari */
        }

        /* For larger screens, adjusting the font size */
        @media (min-width: 1024px) {
            .gradient-text {
                font-size: 4.5rem; /* For larger screens */
            }
        }

        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            .gradient-text {
                background-image: linear-gradient(to right, #3b82f6, #9333ea); /* Dark mode gradient */
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <!-- Replace this with your DriveLine logo -->
            <h1 class="gradient-text">
                DriveLine
            </h1>
        </div>
        
        <div class="email-content">
            <h2>Hello,</h2>
            <p>We received a request to reset your password. Please use the following OTP code to proceed:</p>
            
            <div class="otp-code">{{ $otp }}</div>
            
            <p>For security purposes, please do not share your OTP with anyone.</p>

            <a href="#" class="btn">Verify OTP</a>
        </div>

        <div class="email-footer">
            <p>&copy; {{ date('Y') }} DriveLine. All rights reserved.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
