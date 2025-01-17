<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class ResetPasswordController extends Controller
{
	use ResetsPasswords;

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		$this->middleware('guest');
	}

	public function resetPasswordWithoutToken(Request $request)
	{
		$user = User::where(['email' => $request->email])->first();

		if ($user) {
			$user->sendPasswordSetNotification('reset');

			return response()->json(true);
		} else {
			return response()->json('User is not found');
		}
	}

	public function reset(Request $request)
	{
		$this->validate($request, $this->rules(), $this->validationErrorMessages());

		// Here we will attempt to reset the user's password. If it is successful we
		// will update the password on an actual user model and persist it to the
		// database. Otherwise we will parse the error and return the response.
		$response = $this->broker()->reset(
			$this->credentials($request), function ($user, $password) {
			$this->resetPassword($user, $password);
		}
		);

		// If the password was successfully reset, we will redirect the user back to
		// the application's home authenticated view. If there is an error we can
		// redirect them back to where they came from with their error message.
		return $response == Password::PASSWORD_RESET
			? response()->json($response)
			: response()->json($response);
	}
}
