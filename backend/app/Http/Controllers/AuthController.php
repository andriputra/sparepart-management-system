<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {
    public function register(Request $r) {
        $user = User::create([
            'name' => $r->name,
            'email' => $r->email,
            'password' => bcrypt($r->password),
            'role' => $r->role ?? 'inputer'
        ]);
        return response()->json($user);
    }

    public function login(Request $r) {
        $user = User::where('email', $r->email)->first();
        if(!$user || !Hash::check($r->password, $user->password)) {
            return response()->json(['error'=>'Invalid credentials'], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token'=>$token, 'user'=>$user]);
    }
}