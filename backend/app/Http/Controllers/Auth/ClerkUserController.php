<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use Illuminate\Http\Request;

class ClerkUserController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'clerk_id' => 'required|string',
            'name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'image_url' => 'nullable|string',
        ]);

        $user = User::getOrCreateFromClerkData($validated);

        if ($user->status === 'blocked') {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been blocked.',
                'data' => $user,
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'User synced successfully',
            'data' => $user,
        ]);
    }
}