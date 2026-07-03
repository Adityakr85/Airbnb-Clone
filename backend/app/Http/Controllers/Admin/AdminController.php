<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use App\Models\Property\Property;
use App\Models\Reservation\Reservation;
use App\Models\Review\Review;
use App\Models\Wishlist\Wishlist;
use App\Models\Message\Message;
use App\Services\Notification\NotificationService;
use App\Models\Category\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Check if the user is an admin
     */
    protected function isAdmin($user)
    {
        if (!$user) return false;

        // Allow different role capitalizations coming from Clerk / DB
        $role = $user->role;

        return is_string($role) && strtolower($role) === 'admin';
    }

    /**
     * Admin dashboard stats
     */
    public function dashboard(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

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
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin');

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $users = User::withCount([
            'reservations as bookings' => function($query) {
                $query->whereIn('status', ['confirmed', 'completed']);
            }
        ])
        ->get()
        ->map(function ($user) {
            // Calculate total spent from confirmed/completed reservations
            $totalSpent = $user->reservations()
                ->whereIn('status', ['confirmed', 'completed'])
                ->sum('total');
            
            // Use actual status field, fallback to inference if needed
            $status = $user->status 
                ? ($user->status === 'blocked' ? 'Blocked' : ucfirst($user->status)) 
                : (!is_null($user->email_verified_at) ? 'Active' : 'Pending');
            
            // Format joined date
            $joined = $user->created_at ? $user->created_at->format('M d, Y') : 'Unknown';
            
            // Format last login (use actual last_login_at if available, otherwise updated_at)
            $lastLoginDate = !is_null($user->last_login_at) 
                ? $user->last_login_at 
                : $user->updated_at;
            $lastLogin = $lastLoginDate ? $lastLoginDate->diffForHumans() : 'Unknown';
            
            // Format spent amount
            $spent = '₹' . number_format($totalSpent, 0);
            
            // Get profile image or use default
            $image = $user->profile_image 
                ? (filter_var($user->profile_image, FILTER_VALIDATE_URL) 
                    ? $user->profile_image 
                    : asset('storage/' . ltrim($user->profile_image, '/'))
                )
                : "https://i.pravatar.cc/150?img={($user->id % 10) + 1}"; // Deterministic but varied image

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $status,
                'verified' => !is_null($user->email_verified_at),
                'joined' => $joined,
                'lastLogin' => $lastLogin,
                'bookings' => $user->bookings,
                'spent' => $spent,
                'image' => $image,
            ];
        });

        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Get all properties
     */
    public function properties(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $properties = Property::with(['host', 'images', 'category'])
            ->get()
            ->map(function ($property) {
                // Get images from relationship
                $images = $property->images->pluck('image_path')->toArray();
                $coverImage = $property->images->where('is_cover', true)->first();
                $firstImage = $coverImage
                ? $coverImage->image_path
                : ($images[0] ?? null);
                
                $imageUrl = $firstImage ?: '/placeholder.jpg';
                
                // Use moderation status if available, otherwise infer from status
                if (!is_null($property->moderation_status)) {
                    $status = ucfirst($property->moderation_status); // pending->Pending, approved->Approved, rejected->Rejected
                } else {
                    // Fallback: map active/inactive to Approved/Pending
                    $statusMapping = [
                        'active' => 'Approved',
                        'inactive' => 'Pending'
                    ];
                    $status = $statusMapping[$property->status] ?? 'Pending';
                }
                
                // Format price
                $priceFormatted = '₹' . number_format((float)($property->price ?? 0), 0);
                
                // Format rating (ensure it's a float with 1 decimal)
                $rating = $property->rating ? round((float)$property->rating, 1) : 0;
                
                // Format date
                $created = $property->created_at ? $property->created_at->format('M d, Y') : 'Unknown';
                
                return [
                    'id' => $property->id,
                    'title' => (string) ($property->title ?? ''),
                    'host' => $property->host ? (string) ($property->host->name ?? 'Unknown') : 'Unknown',
                    'location' => (string) ($property->location ?? ''),
                    'price' => (string) $priceFormatted,
                    'status' => (string) $status,
                    'rating' => (float) $rating,
                    'bookings' => (int) ($property->bookings ?? 0),
                    'category_id' => $property->category_id,
                    'category' => $property->category,
                    'category_name' => $property->category ? $property->category->name : 'Property',
                    'created' => (string) $created,
                   'image' => (string) $imageUrl,
                   'images' => $images,
                   'image_urls' => $images,
                   'moderation_status' => $property->moderation_status,
                ];
            });

        return response()->json(['success' => true, 'data' => $properties]);
    }

/**
     * Approve a property
     */
    public function approveProperty(Request $request, $id)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $property = Property::find($id);
        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Property not found'], 404);
        }

        $property->moderation_status = 'approved';
        $property->status = 'active';
        $property->save();

        // Notify host about approval
        $property->load('host');
        $this->notificationService->notifyHostPropertyApproved($property);

        return response()->json(['success' => true, 'message' => 'Property approved successfully']);
    }

    /**
     * Reject a property
     */
    public function rejectProperty(Request $request, $id)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $property = Property::find($id);
        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Property not found'], 404);
        }

        $reason = $request->input('reason', '');
        $property->moderation_status = 'rejected';
        $property->status = 'inactive';
        $property->save();

        // Notify host about rejection
        $property->load('host');
        $this->notificationService->notifyHostPropertyRejected($property, $reason);

return response()->json(['success' => true, 'message' => 'Property rejected successfully']);
    }
public function categories(Request $request)
{
    $clerkId = $request->query('clerk_id');
    $role = $request->query('role');
    $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

    if (!$this->isAdmin($user)) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $query = Category::query();

    if ($request->filled('category_for')) {
        $query->where('category_for', $request->category_for);
    }

    if ($request->filled('search')) {
        $search = trim($request->search);
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('slug', 'like', "%{$search}%");
        });
    }

    return response()->json([
        'success' => true,
        'data' => $query
            ->orderBy('category_for')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(),
    ]);
}

public function storeCategory(Request $request)
{
    $clerkId = $request->query('clerk_id');
    $role = $request->query('role');
    $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

    if (!$this->isAdmin($user)) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'category_for' => 'required|in:property,experience',
        'icon' => 'required|string|max:255',
        'image' => 'nullable|string|max:255',
        'is_active' => 'nullable|boolean',
        'sort_order' => 'nullable|integer|min:0',
    ]);

    $category = Category::create([
        'name' => $validated['name'],
        'slug' => Str::slug($validated['name']),
        'category_for' => $validated['category_for'],
        'icon' => $validated['icon'],
        'image' => $validated['image'] ?? null,
        'is_active' => $request->boolean('is_active', true),
        'sort_order' => $validated['sort_order'] ?? 0,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Category created successfully',
        'data' => $category,
    ], 201);
}

public function updateCategory(Request $request, $id)
{
    $clerkId = $request->query('clerk_id');
    $role = $request->query('role');
    $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

    if (!$this->isAdmin($user)) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $category = Category::find($id);

    if (!$category) {
        return response()->json(['success' => false, 'message' => 'Category not found'], 404);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'category_for' => 'required|in:property,experience',
        'icon' => 'required|string|max:255',
        'image' => 'nullable|string|max:255',
        'is_active' => 'nullable|boolean',
        'sort_order' => 'nullable|integer|min:0',
    ]);

    $category->update([
        'name' => $validated['name'],
        'slug' => Str::slug($validated['name']),
        'category_for' => $validated['category_for'],
        'icon' => $validated['icon'],
        'image' => $validated['image'] ?? null,
        'is_active' => $request->boolean('is_active', true),
        'sort_order' => $validated['sort_order'] ?? 0,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Category updated successfully',
        'data' => $category,
    ]);
}

public function deleteCategory(Request $request, $id)
{
    $clerkId = $request->query('clerk_id');
    $role = $request->query('role');
    $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

    if (!$this->isAdmin($user)) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $category = Category::find($id);

    if (!$category) {
        return response()->json(['success' => false, 'message' => 'Category not found'], 404);
    }

    if ($category->properties()->exists()) {
        return response()->json([
            'success' => false,
            'message' => 'Cannot delete category because properties are using it',
        ], 400);
    }

    $category->delete();

    return response()->json([
        'success' => true,
        'message' => 'Category deleted successfully',
    ]);
}

public function toggleCategory(Request $request, $id)
{
    $clerkId = $request->query('clerk_id');
    $role = $request->query('role');
    $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

    if (!$this->isAdmin($user)) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $category = Category::find($id);

    if (!$category) {
        return response()->json(['success' => false, 'message' => 'Category not found'], 404);
    }

    $category->update([
        'is_active' => !$category->is_active,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Category status updated',
        'data' => $category,
    ]);
}
    /**
     * Get analytics data
     */
    public function reservations(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $reservations = Reservation::with(['property.host', 'guest'])
            ->get()
            ->map(function ($reservation) {
                // Format ID as RSV-xxxx
                $id = 'RSV-' . str_pad($reservation->id, 4, '0', STR_PAD_LEFT);
                
                // Get guest info
                $guestName = $reservation->guest ? $reservation->guest->name : 'Unknown';
                $guestEmail = $reservation->guest ? $reservation->guest->email : '';
                
                // Get host info (through property)
                $hostName = $reservation->property && $reservation->property->host 
                    ? $reservation->property->host->name 
                    : 'Unknown';
                
                // Get property title
                $propertyTitle = $reservation->property ? $reservation->property->title : 'Unknown';
                
                // Format dates
                $checkIn = $reservation->check_in ? 
                    (new \DateTime($reservation->check_in))->format('M d, Y') : 'Unknown';
                $checkOut = $reservation->check_out ? 
                    (new \DateTime($reservation->check_out))->format('M d, Y') : 'Unknown';
                $created = $reservation->created_at ? 
                    $reservation->created_at->format('M d, Y') : 'Unknown';
                
                // Calculate nights
                $nights = 0;
                if ($reservation->check_in && $reservation->check_out) {
                    $checkInDt = new \DateTime($reservation->check_in);
                    $checkOutDt = new \DateTime($reservation->check_out);
                    $nights = $checkInDt->diff($checkOutDt)->days;
                }
                
                // Format amount
                $amount = '₹' . number_format($reservation->total, 0);
                
                // Use payment status field if available, otherwise infer from reservation status
                if (!is_null($reservation->payment_status)) {
                    $paymentStatusMap = [
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'refunded' => 'Refunded',
                        'failed' => 'Failed'
                    ];
                    $paymentStatus = $paymentStatusMap[$reservation->payment_status] ?? 'Pending';
                } else {
                    // Fallback: infer payment status from reservation status
                    // Mapping based on mock data: Confirmed->Paid, Pending->Pending, Cancelled->Refunded
                    $paymentStatusMap = [
                        'confirmed' => 'Paid',
                        'pending' => 'Pending',
                        'completed' => 'Paid', // Assume completed means paid
                        'cancelled' => 'Refunded'
                    ];
                    $paymentStatus = $paymentStatusMap[$reservation->status] ?? 'Pending';
                }
                
                // Map reservation status to frontend status
                $statusMap = [
                    'confirmed' => 'Confirmed',
                    'pending' => 'Pending',
                    'completed' => 'Confirmed', // Treat completed as confirmed for display
                    'cancelled' => 'Cancelled'
                ];
                $status = $statusMap[$reservation->status] ?? 'Pending';
                
                return [
                    'id' => $id,
                    'guest' => $guestName,
                    'guestEmail' => $guestEmail,
                    'host' => $hostName,
                    'property' => $propertyTitle,
                    'checkIn' => $checkIn,
                    'checkOut' => $checkOut,
                    'nights' => (int)$nights,
                    'amount' => $amount,
                    'payment' => $paymentStatus,
                    'status' => $status,
                    'created' => $created,
                ];
            });

        return response()->json(['success' => true, 'data' => $reservations]);
    }

    /**
     * Get analytics data
     */
    public function analytics(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

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

    /**
     * Get all notifications for admin
     */
    public function notifications(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $notifications = \App\Models\Notification\Notification::latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Send a notification to users
     */
    public function sendNotification(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        $role = $request->query('role');
        $user = User::getOrCreateFromClerkId($clerkId, 'User', null, 'admin', $role);

        if (!$this->isAdmin($user)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'audience' => 'required|in:all,guests,hosts,admins',
            'type' => 'required|string|max:50',
        ]);

        // Send to all users based on audience
        $usersQuery = User::query();
        
        if ($validated['audience'] === 'guests') {
            $usersQuery->where('role', 'guest');
        } elseif ($validated['audience'] === 'hosts') {
            $usersQuery->where('role', 'host');
        } elseif ($validated['audience'] === 'admins') {
            $usersQuery->where('role', 'admin');
        }

        $users = $usersQuery->get();
        
        foreach ($users as $targetUser) {
            \App\Models\Notification\Notification::create([
                'user_id' => $targetUser->id,
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'],
                'data' => ['audience' => $validated['audience']],
                'is_read' => false,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification sent to ' . count($users) . ' users',
        ]);
    }
}
