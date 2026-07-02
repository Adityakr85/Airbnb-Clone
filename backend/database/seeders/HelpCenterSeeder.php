<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HelpCenterContent;

class HelpCenterSeeder extends Seeder
{
    public function run(): void
    {
        HelpCenterContent::updateOrCreate(
            ['url' => '/help/article/1'], 
            [
                'content_type' => 'top_article',
                'tab_category' => 'Host',
                'title'        => 'Message your host',
                'summary'      => 'Need to get in touch? You can message your host before, during, or after your trip.',
            ]
        );

        // Guest: Guide Card
        HelpCenterContent::updateOrCreate(
            ['url' => '/help/article/2'],
            [
                'content_type' => 'guide',
                'tab_category' => 'Guest',
                'title'        => 'AirCover for guests',
                'summary'      => 'Our comprehensive protection included for free with every booking.',
                'image'        => 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=600&auto=format&fit=crop',
            ]
        );

        // Experience Host: Top Article
        HelpCenterContent::updateOrCreate(
            ['url' => '/help/article/3'],
            [
                'content_type' => 'top_article',
                'tab_category' => 'Experience host',
                'title'        => 'Review policies for experiences',
                'summary'      => 'Find out how reviews work for hosts of Airbnb Experiences.',
            ]
        );

        // Experience Host: Guide Card
        HelpCenterContent::updateOrCreate(
            ['url' => '/help/article/4'],
            [
                'content_type' => 'guide',
                'tab_category' => 'Experience host',
                'title'        => 'How co-hosting works for Experiences',
                'summary'      => 'Learn how to add a co-host to help run your local experience.',
                'image'        => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
            ]
        );

        // ---------------------------------------------------------
        // GLOBAL PROMO BANNERS
        // ---------------------------------------------------------
        
        HelpCenterContent::updateOrCreate(
            ['title' => 'Our community policies', 'content_type' => 'explore_promo'],
            [
                'tab_category' => 'Global',
                'summary'      => 'How we build a foundation of trust.',
                'image'        => 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop',
            ]
        );

        // ---------------------------------------------------------
        // DIRECTORY TOPICS & ARTICLES
        // ---------------------------------------------------------

        $cancellationsTopic = HelpCenterContent::updateOrCreate(
            ['title' => 'Cancellations', 'content_type' => 'topic'],
            [
                'tab_category' => 'Guest',
                'section_heading' => 'Your reservations as a guest',
                'summary'      => 'Cancelling a reservation; Host-initiated cancellations; Cancellation policies',
            ]
        );

        // Section 1: Cancelling a reservation
        HelpCenterContent::updateOrCreate(
            ['title' => 'Cancel your home reservation as a guest', 'content_type' => 'article'],
            [
                'parent_id'       => $cancellationsTopic->id, 
                'tab_category'    => 'Guest', 
                'section_heading' => 'Cancelling a reservation', 
                'summary'         => 'You can cancel or make changes to your home reservation in your trips.',
                
                // Example of adding structured body content for the React sidebar
                'content_sections' => [
                    [
                        'id' => 'cancel-steps',
                        'title' => 'Steps to cancel',
                        'content' => '<p>Go to your Trips tab to find the cancellation options.</p>'
                    ]
                ]
            ]
        );

        HelpCenterContent::updateOrCreate(
            ['title' => 'Cancelling a reservation paid for using Klarna', 'content_type' => 'article'],
            [
                'parent_id'       => $cancellationsTopic->id,
                'tab_category'    => 'Guest',
                'section_heading' => 'Cancelling a reservation',
                'summary'         => 'Even if you have a Klarna payment plan, you can still cancel your reservation on Airbnb.',
            ]
        );

        HelpCenterContent::updateOrCreate(
            ['title' => 'Standard cancellation policies', 'content_type' => 'article'],
            [
                'parent_id'       => $cancellationsTopic->id,
                'tab_category'    => 'Guest', // The Model Accessor will turn this into "article • Guest"
                'section_heading' => 'Cancellation policies',
                'summary'         => 'Learn about the different cancellation policies hosts can choose from.',
            ]
        );

        // The Directory Links
        HelpCenterContent::updateOrCreate(
            ['title' => 'Cancellations', 'content_type' => 'topic_link'],
            [
                'tab_category'    => 'Guest',
                'section_heading' => 'Your reservations as a guest', 
                'url'             => '/help/topic/' . $cancellationsTopic->id, 
            ]
        );

        HelpCenterContent::updateOrCreate(
            ['title' => 'Checking in', 'content_type' => 'topic_link'],
            [
                'tab_category'    => 'Guest',
                'section_heading' => 'Your reservations as a guest',
                'url'             => '/help/article/105',
            ]
        );
    }
}