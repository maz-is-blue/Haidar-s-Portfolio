<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $submission = ContactSubmission::create($request->only('name', 'email', 'org', 'message'));
        return response()->json(['message' => 'Message sent'], 201);
    }

    public function index()
    {
        return response()->json(ContactSubmission::latest()->get());
    }

    public function markRead(ContactSubmission $contactSubmission)
    {
        $contactSubmission->update(['read_at' => now()]);
        return response()->json($contactSubmission->fresh());
    }

    public function destroy(ContactSubmission $contactSubmission)
    {
        $contactSubmission->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
