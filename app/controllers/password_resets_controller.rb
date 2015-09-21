class PasswordResetsController < ApplicationController

	skip_before_filter :authenticate_request

	# Password Reset form submitted
	def create 
		@user = User.find_by_email(params[:email])

		# Calls designated method in designated mailer class to generate token and send email
		@user.deliver_reset_password_instructions! if @user
		head :ok
	end

	# New Password form
	def edit
		@token = params[:id]
		@user = User.load_from_reset_password_token(params[:id])

		if @user.blank?
			fail PasswordResetTokenInvalid
		else
			render json: {username: @user.username, avatar: @user.avatar_path}
		end
	end

	# New Password form submitted
	def update
		@token = params[:id]
		@user = User.load_from_reset_password_token(params[:id])

		if @user.blank?
			fail NotAuthenticatedError
		end

		# If password confirmation is required...
		# @user.password_confirmation = params[:password_confirmation]

		# the next line clears the temporary token and updates the password
		if @user.change_password!(params[:password])
			head :ok
		else
			render json: @user.errors, status: :unprocessable_entity
		end
	end


end
