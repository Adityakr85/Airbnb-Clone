<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HelpCenterContent;

class HelpCenterSeeder extends Seeder
{
    public function run(): void
    {
        HelpCenterContent::truncate();
        
        // Guest: Top Article
        HelpCenterContent::create([
            'content_type' => 'top_article',
            'category'     => 'Guest',
            'title'        => 'Cancel your home reservation as a guest',
            'summary'      => 'You can cancel or make changes to your home reservation in your trips.',
            'url'          => '/help/article/1',
        ]);

        // Guest: Guide Card
        HelpCenterContent::create([
            'content_type' => 'guide',
            'category'     => 'Guest',
            'title'        => 'AirCover for guests',
            'summary'      => 'Our comprehensive protection included for free with every booking.',
            'image'        => 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=600&auto=format&fit=crop',
            'url'          => '/help/article/2',
        ]);

        // Experience Host: Top Article
        HelpCenterContent::create([
            'content_type' => 'top_article',
            'category'     => 'Experience host',
            'title'        => 'Review policies for experiences',
            'summary'      => 'Find out how reviews work for hosts of Airbnb Experiences.',
            'url'          => '/help/article/3',
        ]);

        // Experience Host: Guide Card
        HelpCenterContent::create([
            'content_type' => 'guide',
            'category'     => 'Experience host',
            'title'        => 'How co-hosting works for Experiences',
            'summary'      => 'Learn how to add a co-host to help run your local experience.',
            'image'        => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
            'url'          => '/help/article/4',
        ]);

        // ---------------------------------------------------------
        // GLOBAL PROMO BANNERS
        // ---------------------------------------------------------
        
        HelpCenterContent::create([
            'content_type' => 'explore_promo',
            'category'     => 'Global',
            'title'        => 'Our community policies',
            'summary'      => 'How we build a foundation of trust.',
            'image'        => 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop',
        ]);

       $cancellationsTopic = HelpCenterContent::create([
            'content_type' => 'topic',
            'category'     => 'Guest',
            'title'        => 'Cancellations',
            'summary'      => 'Cancelling a reservation; Host-initiated cancellations; Cancellation policies',
            
            'breadcrumbs'  => json_encode([
                ['label' => 'Home', 'url' => '/help'],
                ['label' => 'All topics', 'url' => '/help/all-topics'],
                ['label' => 'Your reservations as a guest', 'url' => '#'],
                ['label' => 'Cancellations', 'url' => '/help/topic/1360'], 
            ]),
        ]);
        // Section 1: Cancelling a reservation
        HelpCenterContent::create([
            'parent_id'    => $cancellationsTopic->id, 
            'content_type' => 'article',
            'category'     => 'How-to • Guest', // Used as the UI 'tag'
            'section'      => 'Cancelling a reservation', // Groups it under this <h2>
            'title'        => 'Cancel your home reservation as a guest',
            'summary'      => 'You can cancel or make changes to your home reservation in your trips.',
        ]);

        HelpCenterContent::create([
            'parent_id'    => $cancellationsTopic->id,
            'content_type' => 'article',
            'category'     => 'How-to • Guest',
            'section'      => 'Cancelling a reservation',
            'title'        => 'Cancelling a reservation paid for using Klarna',
            'summary'      => 'Even if you have a Klarna payment plan, you can still cancel your reservation on Airbnb.',
        ]);

        HelpCenterContent::create([
            'parent_id'    => $cancellationsTopic->id,
            'content_type' => 'article',
            'category'     => 'Policy • Guest',
            'section'      => 'Cancellation policies',
            'title'        => 'Standard cancellation policies',
            'summary'      => 'Learn about the different cancellation policies hosts can choose from.',
        ]);
        HelpCenterContent::create([
            'content_type' => 'topic_link',
            'category'     => 'Guest',
            'section'      => 'Your reservations as a guest', 
            'title'        => 'Cancellations',
            'url'          => '/help/topic/' . $cancellationsTopic->id, 
        ]);

        HelpCenterContent::create([
            'content_type' => 'topic_link',
            'category'     => 'Guest',
            'section'      => 'Your reservations as a guest',
            'title'        => 'Checking in',
            'url'          => '/help/article/105',
        ]);
    }
}
