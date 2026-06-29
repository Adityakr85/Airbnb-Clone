<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CloudinaryService
{
    protected $cloudName;
    protected $apiKey;
    protected $apiSecret;
    protected $baseUrl;
    protected $enabled = false;

    public function __construct()
    {
        $this->cloudName = config('services.cloudinary.cloud_name');
        $this->apiKey = config('services.cloudinary.api_key');
        $this->apiSecret = config('services.cloudinary.api_secret');
        
        // Enable Cloudinary only if all credentials are provided
        $this->enabled = !empty($this->cloudName) && !empty($this->apiKey) && !empty($this->apiSecret);
        
        if ($this->enabled) {
            $this->baseUrl = "https://api.cloudinary.com/v1_1/{$this->cloudName}";
        }
    }

    /**
     * Check if Cloudinary is enabled
     */
    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    /**
     * Upload image to Cloudinary or local storage
     */
    public function upload($file, $folder = 'properties')
    {
        if ($this->enabled) {
            return $this->uploadToCloudinary($file, $folder);
        }
        
        // Fallback to local storage
        return $this->uploadToLocal($file, $folder);
    }

    /**
     * Upload to Cloudinary
     */
    protected function uploadToCloudinary($file, $folder = 'properties')
    {
        $timestamp = time();
        $publicId = $folder . '/' . Str::uuid();

        $params = [
            'file' => $file,
            'public_id' => $publicId,
            'folder' => $folder,
            'timestamp' => $timestamp,
            'api_key' => $this->apiKey,
        ];

        $params['signature'] = $this->generateSignature($params);

        $response = Http::attach(
            'file', file_get_contents($file), $file->getClientOriginalName()
        )->post("{$this->baseUrl}/image/upload", $params);

        if ($response->successful()) {
            $data = $response->json();
            return [
                'url' => $data['secure_url'],
                'public_id' => $data['public_id'],
                'width' => $data['width'] ?? null,
                'height' => $data['height'] ?? null,
            ];
        }

        throw new \Exception('Cloudinary upload failed: ' . $response->body());
    }

    /**
     * Upload to local storage (fallback)
     */
    protected function uploadToLocal($file, $folder = 'properties')
    {
        $path = $file->store($folder, 'public');
        
        return [
            'url' => asset('storage/' . ltrim($path, '/')),
            'public_id' => $path,
            'width' => null,
            'height' => null,
        ];
    }

    /**
     * Delete image from Cloudinary or local storage
     */
    public function delete($publicId)
    {
        if ($this->enabled) {
            return $this->deleteFromCloudinary($publicId);
        }
        
        // Fallback to local storage
        return $this->deleteFromLocal($publicId);
    }

    /**
     * Delete from Cloudinary
     */
    protected function deleteFromCloudinary($publicId)
    {
        $timestamp = time();
        $params = [
            'public_id' => $publicId,
            'timestamp' => $timestamp,
            'api_key' => $this->apiKey,
        ];

        $params['signature'] = $this->generateSignature($params);

        $response = Http::post("{$this->baseUrl}/image/destroy", $params);

        return $response->successful();
    }

    /**
     * Delete from local storage
     */
    protected function deleteFromLocal($path)
    {
        return Storage::disk('public')->delete($path);
    }

/**
     * Generate Cloudinary API signature
     */
    protected function generateSignature(array $params): string
    {
        // Sort params by key
        ksort($params);
        
        // Build string to sign (exclude api_key, signature, and file per Cloudinary docs)
        $string = '';
        foreach ($params as $key => $value) {
            if ($key !== 'signature' && $key !== 'file' && $key !== 'api_key') {
                $string .= $key . '=' . $value . '&';
            }
        }
        $string = rtrim($string, '&');
        
        // Append api_secret
        $string .= $this->apiSecret;
        
        // Generate SHA1 hash
        return sha1($string);
    }

    /**
     * Get optimized image URL
     */
    public function getOptimizedUrl($publicId, $options = [])
    {
        if (!$this->enabled) {
            return asset('storage/' . ltrim($publicId, '/'));
        }
        
        $defaults = [
            'fetch_format' => 'auto',
            'quality' => 'auto',
        ];
        $options = array_merge($defaults, $options);
        
        $transformations = [];
        foreach ($options as $key => $value) {
            if ($value !== null && $value !== '') {
                $transformations[] = $key . '_' . $value;
            }
        }
        
        $transformStr = empty($transformations) ? '' : implode(',', $transformations) . '/';
        
        return "https://res.cloudinary.com/{$this->cloudName}/image/upload/{$transformStr}{$publicId}";
    }
}