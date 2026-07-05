<?php

namespace App\Events;

use App\Models\User\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        // Find the user receiving the message to get their Clerk ID
        $receiver = User::find($this->message['receiver_id']);
        
        // Broadcast specifically to the Clerk ID that React is listening to
        return [
            new PrivateChannel('chat.' . $receiver->clerk_id),
        ];
    }
    
    public function broadcastWith(): array
    {
        return [
            'id' => $this->message['id'],
            'body' => $this->message['body'],
            // Send back the integer ID so React knows which conversation to update
            'sender_id' => $this->message['sender_id'],
            'created_at' => $this->message['created_at'],
        ];
    }
}