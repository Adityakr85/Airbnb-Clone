<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use App\Models\Property\Property;
use App\Models\Reservation\Reservation;
use App\Models\Category\Category;
use App\Services\Notification\NotificationService;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected $notificationService;

    protected array $roleLevels = [
        'guest' => 1,
        'host' => 2,
        'moderator' => 3,
        'support' => 4,
        'finance' => 5,
        'manager' => 6,
        'admin' => 7,
    ];

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    protected function getActor(Request $request)
    {
        $clerkId = $request->query('clerk_id') ?? $request->input('clerk_id');

        if (!$clerkId) {
            return null;
        }

        return User::where('clerk_id', $clerkId)->first();
    }

public function currentUser(Request $request)
{
    $clerkId = $request->query('clerk_id');

    if (!$clerkId) {
        return response()->json([
            'success' => false,
            'message' => 'Missing clerk_id',
        ], 400);
    }

    $user = User::where('clerk_id', $clerkId)->first();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found',
        ], 404);
    }

    if ($user->status === 'blocked') {
        return response()->json([
            'success' => false,
            'message' => 'User blocked',
        ], 403);
    }

    return response()->json([
        'success' => true,
        'data' => $user,
    ]);
}
    protected function isAdminStaff($user): bool
    {
        if (!$user || !$user->role) {
            return false;
        }

        $role = strtolower($user->role);

        return isset($this->roleLevels[$role]) && $this->roleLevels[$role] >= 3;
    }

    protected function canManageUser($actor, $target): bool
    {
        if (!$actor || !$target) {
            return false;
        }

        $actorLevel = $this->roleLevels[strtolower($actor->role)] ?? 0;
        $targetLevel = $this->roleLevels[strtolower($target->role)] ?? 0;

        return $actorLevel > $targetLevel;
    }

    protected function requireAdminStaff(Request $request)
    {
        $actor = $this->getActor($request);

        if (!$this->isAdminStaff($actor)) {
            abort(response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403));
        }

        return $actor;
    }

    public function dashboard(Request $request)
    {
        $this->requireAdminStaff($request);

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

    public function users(Request $request)
    {
        $this->requireAdminStaff($request);

        $users = User::withCount([
            'reservations as bookings' => function ($query) {
                $query->whereIn('status', ['confirmed', 'completed']);
            }
        ])
            ->latest()
            ->get()
            ->map(function ($user) {
                $totalSpent = $user->reservations()
                    ->whereIn('status', ['confirmed', 'completed'])
                    ->sum('total');

                $status = $user->status
                    ? ($user->status === 'blocked' ? 'Blocked' : ucfirst($user->status))
                    : 'Active';

                $joined = $user->created_at ? $user->created_at->format('M d, Y') : 'Unknown';

                $lastLoginDate = $user->last_login_at ?: $user->updated_at;
                $lastLogin = $lastLoginDate ? $lastLoginDate->diffForHumans() : 'Unknown';

                $spent = '₹' . number_format($totalSpent, 0);

                $image = $user->profile_image
                    ? (filter_var($user->profile_image, FILTER_VALIDATE_URL)
                        ? $user->profile_image
                        : asset('storage/' . ltrim($user->profile_image, '/')))
                    : ($user->clerk_image_url ?: "https://i.pravatar.cc/150?img=" . (($user->id % 10) + 1));

                return [
                    'id' => $user->id,
                    'clerk_id' => $user->clerk_id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $status,
                    'raw_status' => $user->status,
                    'verified' => !is_null($user->email_verified_at),
                    'joined' => $joined,
                    'lastLogin' => $lastLogin,
                    'bookings' => $user->bookings,
                    'spent' => $spent,
                    'image' => $image,
                    'clerk_image_url' => $user->clerk_image_url,
                ];
            });

        return response()->json(['success' => true, 'data' => $users]);
    }

    public function updateUserRole(Request $request, $id)
    {
        $validated = $request->validate([
            'clerk_id' => 'required|string',
            'role' => 'required|in:guest,host,moderator,support,finance,manager,admin',
        ]);

        $actor = $this->requireAdminStaff($request);
        $target = User::findOrFail($id);

        if (!$this->canManageUser($actor, $target)) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot manage a user with equal or higher role.',
            ], 403);
        }

        $actorLevel = $this->roleLevels[strtolower($actor->role)] ?? 0;
        $newRoleLevel = $this->roleLevels[$validated['role']] ?? 0;

        if ($newRoleLevel >= $actorLevel) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot assign a role equal to or higher than your own.',
            ], 403);
        }

        $target->update([
            'role' => $validated['role'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully.',
            'data' => $target,
        ]);
    }

    public function updateUserStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'clerk_id' => 'required|string',
            'status' => 'required|in:active,blocked',
        ]);

        $actor = $this->requireAdminStaff($request);
        $target = User::findOrFail($id);

        if (!$this->canManageUser($actor, $target)) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot manage a user with equal or higher role.',
            ], 403);
        }

        $target->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully.',
            'data' => $target,
        ]);
    }

    public function deleteUser(Request $request, $id)
    {
        $request->validate([
            'clerk_id' => 'required|string',
        ]);

        $actor = $this->requireAdminStaff($request);
        $target = User::findOrFail($id);

        if (!$this->canManageUser($actor, $target)) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete a user with equal or higher role.',
            ], 403);
        }

        $target->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

    public function properties(Request $request)
    {
        $this->requireAdminStaff($request);

        $properties = Property::with(['host', 'images', 'category'])
            ->get()
            ->map(function ($property) {
                $images = $property->images->pluck('image_path')->toArray();
                $coverImage = $property->images->where('is_cover', true)->first();

                $firstImage = $coverImage
                    ? $coverImage->image_path
                    : ($images[0] ?? null);

                $imageUrl = $firstImage ?: '/placeholder.jpg';

                if (!is_null($property->moderation_status)) {
                    $status = ucfirst($property->moderation_status);
                } else {
                    $statusMapping = [
                        'active' => 'Approved',
                        'inactive' => 'Pending',
                    ];

                    $status = $statusMapping[$property->status] ?? 'Pending';
                }

                $priceFormatted = '₹' . number_format((float) ($property->price ?? 0), 0);
                $rating = $property->rating ? round((float) $property->rating, 1) : 0;
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

    public function approveProperty(Request $request, $id)
    {
        $this->requireAdminStaff($request);

        $property = Property::find($id);

        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Property not found'], 404);
        }

        $property->moderation_status = 'approved';
        $property->status = 'active';
        $property->save();

        $property->load('host');
        $this->notificationService->notifyHostPropertyApproved($property);

        return response()->json(['success' => true, 'message' => 'Property approved successfully']);
    }

    public function rejectProperty(Request $request, $id)
    {
        $this->requireAdminStaff($request);

        $property = Property::find($id);

        if (!$property) {
            return response()->json(['success' => false, 'message' => 'Property not found'], 404);
        }

        $reason = $request->input('reason', '');

        $property->moderation_status = 'rejected';
        $property->status = 'inactive';
        $property->save();

        $property->load('host');
        $this->notificationService->notifyHostPropertyRejected($property, $reason);

        return response()->json(['success' => true, 'message' => 'Property rejected successfully']);
    }

    public function categories(Request $request)
    {
        $this->requireAdminStaff($request);

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
        $this->requireAdminStaff($request);

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
        $this->requireAdminStaff($request);

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
        $this->requireAdminStaff($request);

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
        $this->requireAdminStaff($request);

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

    public function reservations(Request $request)
    {
        $this->requireAdminStaff($request);

        $reservations = Reservation::with(['property.host', 'guest'])
            ->get()
            ->map(function ($reservation) {
                $id = 'RSV-' . str_pad($reservation->id, 4, '0', STR_PAD_LEFT);

                $guestName = $reservation->guest ? $reservation->guest->name : 'Unknown';
                $guestEmail = $reservation->guest ? $reservation->guest->email : '';

                $hostName = $reservation->property && $reservation->property->host
                    ? $reservation->property->host->name
                    : 'Unknown';

                $propertyTitle = $reservation->property ? $reservation->property->title : 'Unknown';

                $checkIn = $reservation->check_in
                    ? (new \DateTime($reservation->check_in))->format('M d, Y')
                    : 'Unknown';

                $checkOut = $reservation->check_out
                    ? (new \DateTime($reservation->check_out))->format('M d, Y')
                    : 'Unknown';

                $created = $reservation->created_at
                    ? $reservation->created_at->format('M d, Y')
                    : 'Unknown';

                $nights = 0;

                if ($reservation->check_in && $reservation->check_out) {
                    $checkInDt = new \DateTime($reservation->check_in);
                    $checkOutDt = new \DateTime($reservation->check_out);
                    $nights = $checkInDt->diff($checkOutDt)->days;
                }

                $amount = '₹' . number_format($reservation->total, 0);

                if (!is_null($reservation->payment_status)) {
                    $paymentStatusMap = [
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'refunded' => 'Refunded',
                        'failed' => 'Failed',
                    ];

                    $paymentStatus = $paymentStatusMap[$reservation->payment_status] ?? 'Pending';
                } else {
                    $paymentStatusMap = [
                        'confirmed' => 'Paid',
                        'pending' => 'Pending',
                        'completed' => 'Paid',
                        'cancelled' => 'Refunded',
                    ];

                    $paymentStatus = $paymentStatusMap[$reservation->status] ?? 'Pending';
                }

                $statusMap = [
                    'confirmed' => 'Confirmed',
                    'pending' => 'Pending',
                    'completed' => 'Confirmed',
                    'cancelled' => 'Cancelled',
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
                    'nights' => (int) $nights,
                    'amount' => $amount,
                    'payment' => $paymentStatus,
                    'status' => $status,
                    'created' => $created,
                ];
            });

        return response()->json(['success' => true, 'data' => $reservations]);
    }

    public function analytics(Request $request)
    {
        $this->requireAdminStaff($request);

        $reservationsPerMonth = Reservation::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $avgReservationValue = Reservation::avg('total');

        $analytics = [
            'reservations_per_month' => $reservationsPerMonth,
            'average_reservation_value' => $avgReservationValue,
        ];

        return response()->json(['success' => true, 'data' => $analytics]);
    }

    public function notifications(Request $request)
    {
        $this->requireAdminStaff($request);

        $notifications = \App\Models\Notification\Notification::latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function sendNotification(Request $request)
    {
        $this->requireAdminStaff($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'audience' => 'required|in:all,guests,hosts,admins',
            'type' => 'required|string|max:50',
        ]);

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