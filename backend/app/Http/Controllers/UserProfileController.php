<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    /**
     * Get the current user's profile
     */
    public function show(Request $request)
    {
        $userId = $request->query('clerk_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID required'
            ], 400);
        }

        $profile = UserProfile::where('clerk_id', $userId)->first();

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }

    /**
     * Update or create the user's profile
     */
    public function update(Request $request)
    {
        $clerkId = $request->input('clerk_id');

        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID required'
            ], 400);
        }

        $data = $request->only([
            'decade',
            'travel',
            'work',
            'pets',
            'school',
            'skill',
            'song',
            'fun_fact',
            'time',
            'obsessed',
            'bio_title',
            'languages',
            'live',
            'intro',
            'interests',
            'photo_url'
        ]);

        $profile = UserProfile::updateOrCreate(
            ['clerk_id' => $clerkId],
            $data
        );

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }

    /**
     * Upload profile photo
     */
    public function uploadPhoto(Request $request)
    {
        $clerkId = $request->input('clerk_id');

        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID required'
            ], 400);
        }

        if (!$request->hasFile('photo')) {
            return response()->json([
                'success' => false,
                'message' => 'No photo uploaded'
            ], 400);
        }

        $file = $request->file('photo');

        // Validate file
        if (!in_array($file->getClientMimeType(), ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file type'
            ], 400);
        }

        // Store file
        $path = $file->store('profile-photos', 'public');

        // Update user profile
        $profile = UserProfile::updateOrCreate(
            ['clerk_id' => $clerkId],
            ['photo_url' => $path]
        );

        return response()->json([
            'success' => true,
            'data' => [
                'photo_url' => $profile->photo_url
            ]
        ]);
    }

    /**
     * Delete profile photo
     */
    public function deletePhoto(Request $request)
    {
        $clerkId = $request->input('clerk_id');

        if (!$clerkId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID required'
            ], 400);
        }

        $profile = UserProfile::where('clerk_id', $clerkId)->first();

        if ($profile && $profile->photo_url) {
            // Delete file from storage
            Storage::disk('public')->delete($profile->photo_url);

            // Update database
            $profile->update(['photo_url' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Photo deleted'
        ]);
    }
}