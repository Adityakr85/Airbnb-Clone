<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get all conversations (distinct threads) for a user
     */
    public function inbox(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        if (!$clerkId) {
            return response()->json(['success' => false, 'message' => 'clerk_id required'], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);

        // Get latest message per conversation partner
        $messages = Message::with(['sender', 'receiver', 'reservation.property'])
            ->where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Group by conversation partner
        $threads = [];
        foreach ($messages as $msg) {
            $partnerId = $msg->sender_id === $user->id ? $msg->receiver_id : $msg->sender_id;
            if (!isset($threads[$partnerId])) {
                $partner = $msg->sender_id === $user->id ? $msg->receiver : $msg->sender;
                $threads[$partnerId] = [
                    'partner_id' => $partnerId,
                    'partner_name' => $partner->name ?? 'User',
                    'partner_avatar' => strtoupper(substr($partner->name ?? 'U', 0, 1)),
                    'last_message' => $msg->body,
                    'last_message_time' => $msg->created_at,
                    'unread' => !$msg->is_read && $msg->receiver_id === $user->id,
                    'type' => $msg->type,
                    'property_title' => $msg->reservation?->property?->title,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => array_values($threads),
        ]);
    }

    /**
     * Get all messages in a conversation with a specific user
     */
    public function thread(Request $request, $partnerId)
    {
        $clerkId = $request->query('clerk_id');
        if (!$clerkId) {
            return response()->json(['success' => false, 'message' => 'clerk_id required'], 400);
        }

        $user = User::getOrCreateFromClerkId($clerkId);
        $partner = User::find($partnerId);

        if (!$partner) {
            return response()->json(['success' => false, 'message' => 'Partner not found'], 404);
        }

        $messages = Message::where(function ($q) use ($user, $partnerId) {
                $q->where('sender_id', $user->id)->where('receiver_id', $partnerId);
            })
            ->orWhere(function ($q) use ($user, $partnerId) {
                $q->where('sender_id', $partnerId)->where('receiver_id', $user->id);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) use ($user) {
                return [
                    'id' => $msg->id,
                    'body' => $msg->body,
                    'type' => $msg->type,
                    'is_read' => $msg->is_read,
                    'is_mine' => $msg->sender_id === $user->id,
                    'created_at' => $msg->created_at,
                ];
            });

        // Mark received messages as read
        Message::where('sender_id', $partnerId)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true, 'data' => $messages]);
    }

    /**
     * Send a message
     */
    public function send(Request $request)
    {
        $clerkId = $request->input('clerk_id');
        $user = User::getOrCreateFromClerkId($clerkId);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Valid Clerk ID required'], 400);
        }

        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'body' => 'required|string|max:2000',
            'type' => 'nullable|in:travelling,support,general',
            'reservation_id' => 'nullable|exists:reservations,id',
        ]);

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $validated['receiver_id'],
            'body' => $validated['body'],
            'type' => $validated['type'] ?? 'general',
            'reservation_id' => $validated['reservation_id'] ?? null,
            'is_read' => false,
        ]);

        return response()->json(['success' => true, 'data' => $message], 201);
    }

    /**
     * Get unread message count
     */
    public function unreadCount(Request $request)
    {
        $clerkId = $request->query('clerk_id');
        if (!$clerkId) {
            return response()->json(['success' => true, 'count' => 0]);
        }

        $user = User::where('clerk_id', $clerkId)->first();
        if (!$user) {
            return response()->json(['success' => true, 'count' => 0]);
        }

        $count = Message::where('receiver_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['success' => true, 'count' => $count]);
    }
}
