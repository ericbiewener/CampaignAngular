class AuthController < ApplicationController
	skip_before_action :authenticate_request

	def authenticate
		if user = login(params[:username_or_email], params[:password])
			render json: AuthController.login_response(user, params[:remember])
		else
			render json: { error: 'Invalid username or password' }, status: :unauthorized
		end
	end

	def self.login_response(user, remember = nil)
		{
			auth_token: JWT.encode({
					user_id: user.id,
					exp: (remember ? 7.days.from_now : 24.hours.from_now).to_i
				},
				ENV.fetch('secret_key_base')
			),
			user: {
				id: user.id,
				username: user.username,
				avatar: user.avatar_path
			}
		}
	end

end