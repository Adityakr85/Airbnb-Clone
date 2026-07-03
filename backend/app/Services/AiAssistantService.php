<?php

namespace App\Services;

use App\Models\Message\Message;
use App\Models\User\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiAssistantService
{
    /**
     * Generate a response from Google Gemini based on sanitized chat history
     */
    public function generateResponse(User $user, User $aiBot): ?string
    {
        try {
            // 0. Verify Key exists before attempting network calls
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) {
                Log::error('Gemini API Error: GEMINI_API_KEY is missing or empty in .env');
                return "My API key hasn't been loaded by the server yet! Please check your .env file and restart 'php artisan serve'.";
            }

            // 1. Fetch the last 10 messages between the User and the AI Bot[cite: 9]
            $recentMessages = Message::where(function ($q) use ($user, $aiBot) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $aiBot->id);
                })
                ->orWhere(function ($q) use ($user, $aiBot) {
                    $q->where('sender_id', $aiBot->id)->where('receiver_id', $user->id);
                })
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->reverse();

            // 2. SANITIZE HISTORY: Gemini strictly requires alternating roles (user -> model -> user -> model)
            $contents = [];
            $lastRole = null;
            
            foreach ($recentMessages as $msg) {
                // Ignore our own previous error messages so we don't feed bad context to the AI
                if (str_contains($msg->body, "trouble connecting to my knowledge base") || str_contains($msg->body, "API key hasn't been loaded")) {
                    continue;
                }

                $role = $msg->sender_id === $user->id ? 'user' : 'model';
                
                // If the user sent 2 messages in a row without an AI reply, combine them!
                if ($role === $lastRole && !empty($contents)) {
                    $lastIndex = count($contents) - 1;
                    $contents[$lastIndex]['parts'][0]['text'] .= "\n\n" . $msg->body;
                } else {
                    $contents[] = [
                        'role' => $role,
                        'parts' => [
                            ['text' => $msg->body]
                        ]
                    ];
                    $lastRole = $role;
                }
            }

            // Gemini API rule: The conversation history MUST start with a 'user' role
            if (!empty($contents) && $contents[0]['role'] === 'model') {
                array_unshift($contents, [
                    'role' => 'user',
                    'parts' => [['text' => 'Hello!']]
                ]);
            }

            // Fallback if no valid messages remain
            if (empty($contents)) {
                $contents[] = [
                    'role' => 'user',
                    'parts' => [['text' => 'Hello!']]
                ];
            }

            // 3. Call the Google Gemini API (Using withoutVerifying to prevent Windows local cURL SSL hangs)
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={$apiKey}";

            $response = Http::withoutVerifying() 
                ->timeout(15)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($endpoint, [
                    'contents' => $contents,
                    'systemInstruction' => [
                        'parts' => [
                            ['text' => "You are the StayFinder AI Support Assistant. You help users with booking stays, understanding experiences, and navigating the platform. Be concise, friendly, and helpful."]
                        ]
                    ],
                    'generationConfig' => [
                        'maxOutputTokens' => 300,
                        'temperature' => 0.7,
                    ]
                ]);

            if ($response->successful()) {
                return $response->json('candidates.0.content.parts.0.text');
            }

            // Log the exact error from Google so we can inspect it in storage/logs/laravel.log[cite: 9]
            Log::error('Gemini API Rejection: ' . $response->status() . ' - ' . $response->body());
            return "I'm having a little trouble connecting to my knowledge base right now. Please try again in a moment!";

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            return "Sorry, I encountered a network error while processing your request.";
        }
    }
}