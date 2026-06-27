<?php

namespace App\Services\Notification;

use App\Models\Notification\Notification;
use App\Models\User\User;
use App\Models\Property\Property;
use App\Models\Reservation\Reservation;

class NotificationService
{
    /**
     * Create a notification for a user
     */
    public function create(array $data): Notification
    {
        return Notification::create($data);
    }

    /**
     * Send notification to a specific user
     */
    public function sendToUser(int $userId, string $title, string $message, string $type, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'data' => $data,
            'is_read' => false,
        ]);
    }

    /**
     * Send notification to multiple users
     */
    public function sendToUsers(array $userIds, string $title, string $message, string $type, array $data = []): void
    {
        $notifications = array_map(function ($userId) use ($title, $message, $type, $data) {
            return [
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'data' => json_encode($data),
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $userIds);

        Notification::insert($notifications);
    }

    /**
     * Notify admin users
     */
    public function notifyAdmins(string $title, string $message, string $type, array $data = []): void
    {
        $adminIds = User::where('role', 'admin')->pluck('id')->toArray();
        if (!empty($adminIds)) {
            $this->sendToUsers($adminIds, $title, $message, $type, $data);
        }
    }

    /**
     * Notify host about new property submission
     */
    public function notifyHostNewProperty(Property $property): void
    {
        $this->sendToUser(
            $property->host_id,
            'New Property Listed',
            "Your property '{$property->title}' has been listed and is pending approval.",
            'property_submitted',
            ['property_id' => $property->id, 'property_title' => $property->title]
        );
    }

    /**
     * Notify admin about new property submission
     */
    public function notifyAdminNewProperty(Property $property): void
    {
        $this->notifyAdmins(
            'New Property Submitted',
            "Property '{$property->title}' by {$property->host->name} is pending approval.",
            'property_submitted',
            ['property_id' => $property->id, 'property_title' => $property->title, 'host_id' => $property->host_id]
        );
    }

    /**
     * Notify host about property approval
     */
    public function notifyHostPropertyApproved(Property $property): void
    {
        $this->sendToUser(
            $property->host_id,
            'Property Approved',
            "Your property '{$property->title}' has been approved and is now live!",
            'property_approved',
            ['property_id' => $property->id, 'property_title' => $property->title]
        );
    }

    /**
     * Notify host about property rejection
     */
    public function notifyHostPropertyRejected(Property $property, string $reason = ''): void
    {
        $message = "Your property '{$property->title}' was not approved.";
        if ($reason) {
            $message .= " Reason: {$reason}";
        }

        $this->sendToUser(
            $property->host_id,
            'Property Rejected',
            $message,
            'property_rejected',
            ['property_id' => $property->id, 'property_title' => $property->title, 'reason' => $reason]
        );
    }

    /**
     * Notify host about new reservation
     */
    public function notifyHostNewReservation(Reservation $reservation): void
    {
        $this->sendToUser(
            $reservation->property->host_id,
            'New Booking Request',
            "You have a new booking request for '{$reservation->property->title}' from {$reservation->guest->name} for {$reservation->guests} guests.",
            'new_reservation',
            [
                'reservation_id' => $reservation->id,
                'property_id' => $reservation->property_id,
                'property_title' => $reservation->property->title,
                'guest_name' => $reservation->guest->name,
                'check_in' => $reservation->check_in,
                'check_out' => $reservation->check_out,
                'total' => $reservation->total,
            ]
        );
    }

    /**
     * Notify guest about reservation confirmation
     */
    public function notifyGuestReservationConfirmed(Reservation $reservation): void
    {
        $this->sendToUser(
            $reservation->guest_id,
            'Booking Confirmed',
            "Your booking for '{$reservation->property->title}' has been confirmed by the host.",
            'reservation_confirmed',
            [
                'reservation_id' => $reservation->id,
                'property_id' => $reservation->property_id,
                'property_title' => $reservation->property->title,
                'check_in' => $reservation->check_in,
                'check_out' => $reservation->check_out,
            ]
        );
    }

    /**
     * Notify guest about reservation cancellation
     */
    public function notifyGuestReservationCancelled(Reservation $reservation, string $reason = ''): void
    {
        $message = "Your booking for '{$reservation->property->title}' has been cancelled.";
        if ($reason) {
            $message .= " Reason: {$reason}";
        }

        $this->sendToUser(
            $reservation->guest_id,
            'Booking Cancelled',
            $message,
            'reservation_cancelled',
            [
                'reservation_id' => $reservation->id,
                'property_id' => $reservation->property_id,
                'property_title' => $reservation->property->title,
                'reason' => $reason,
            ]
        );
    }

    /**
     * Notify host about guest cancellation
     */
    public function notifyHostGuestCancelled(Reservation $reservation, string $reason = ''): void
    {
        $message = "Guest {$reservation->guest->name} cancelled their booking for '{$reservation->property->title}'.";
        if ($reason) {
            $message .= " Reason: {$reason}";
        }

        $this->sendToUser(
            $reservation->property->host_id,
            'Guest Cancelled Booking',
            $message,
            'guest_cancelled',
            [
                'reservation_id' => $reservation->id,
                'property_id' => $reservation->property_id,
                'property_title' => $reservation->property->title,
                'guest_name' => $reservation->guest->name,
                'reason' => $reason,
            ]
        );
    }

    /**
     * Notify host about reservation completion
     */
    public function notifyHostReservationCompleted(Reservation $reservation): void
    {
        $this->sendToUser(
            $reservation->property->host_id,
            'Stay Completed',
            "The stay at '{$reservation->property->title}' for {$reservation->guest->name} has been completed.",
            'reservation_completed',
            [
                'reservation_id' => $reservation->id,
                'property_id' => $reservation->property_id,
                'property_title' => $reservation->property->title,
                'guest_name' => $reservation->guest->name,
            ]
        );
    }

    /**
     * Notify guest about reservation completion
     */
    public function notifyGuestReservationCompleted(Reservation $reservation): void
    {
        $this->sendToUser(
            $reservation->guest_id,
            'Stay Completed',
            "Your stay at '{$reservation->property->title}' has been completed. We hope you had a great experience!",
            'reservation_completed',
            [
                'reservation_id' => $reservation->id,
                'property_id' => $reservation->property_id,
                'property_title' => $reservation->property->title,
            ]
        );
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId): void
    {
        Notification::where('id', $notificationId)->update(['is_read' => true]);
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(int $userId): void
    {
        Notification::where('user_id', $userId)->where('is_read', false)->update(['is_read' => true]);
    }
}