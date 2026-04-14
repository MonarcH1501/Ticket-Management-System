<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;    
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);    
        }

        $token = $user->createToken('api-token', ['*'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    // Endpoint untuk menangani callback dari Google
   public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->getEmail())->first();


            if (!$user) {
                return response()->json([
                    'message' => 'Email Anda belum terdaftar. Silakan hubungi administrator.',
                ], 403);
            }

            $token = $user->createToken('api-token', ['*'])->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal melakukan login dengan Google',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
