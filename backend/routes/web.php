<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use App\Models\User\User;

Route::post('/broadcasting/auth', function (Request $request) {
    // 1. Grab the channel string React is asking for (e.g., "private-chat.user_3Flgg...")
    $requestedChannel = $request->channel_name;
    
    // 2. Chop off "private-chat." to get the pure Clerk ID
    $clerkId = str_replace('private-chat.', '', $requestedChannel);
    
    // 3. Find the real user
    $user = User::where('clerk_id', $clerkId)->first();
    
    if ($user) {
        Auth::login($user);
    }
    
    // 4. Run the channels.php authorization
    return Broadcast::auth($request);
})->middleware('web');

require base_path('routes/channels.php');