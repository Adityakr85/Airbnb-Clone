<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Reservation;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Check if the user is an admin
     */
    protected function isAdmin($user)
    {
        return $user && $user->role === 'admin';
    }

    /**
     * Admin dashboard stats
     */
    public function dashboard(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $stats = [
            'total_users' => User::count(),
            'total_properties' => Property::count(),
            'total_reservations' => Reservation::count(),
            'total_reviews' => \App\Models\Review::count(),
            'total_wishlists' => \App\Models\Wishlist::count(),
            'total_messages' => \App\Models\Message::count(),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }

    /**
     * Get all users
     */
    public function users(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'clerk_id', 'created_at')->get();

        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Get all properties
     */
    public function properties(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $properties = Property::withCount('reservations')->get();

        return response()->json(['success' => true, 'data' => $properties]);
    }

    /**
     * Get all reservations
     */
    public function reservations(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $reservations = Reservation::with(['property', 'guest'])->get();

        return response()->json(['success' => true, 'data' => $reservations]);
    }

    /**
     * Get analytics data
     */
    public function analytics(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Example analytics: reservations per month for the last 6 months
        $reservationsPerMonth = Reservation::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Average reservation value
        $avgReservationValue = Reservation::avg('total');

        // Occupancy rate (simplified: percentage of nights booked vs total available nights)
        // This would require more data, so we'll skip for now or use a placeholder.

        $analytics = [
            'reservations_per_month' => $reservationsPerMonth,
            'average_reservation_value' => $avgReservationValue,
            // Add more analytics as needed
        ];

        return response()->json(['success' => true, 'data' => $analytics]);
    }
}
