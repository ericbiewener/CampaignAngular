class UsersController < ApplicationController
	skip_before_filter :authenticate_request, only: [:new, :create]
	
	before_action :enforce_current_user, only: [:edit, :update, :destroy]
	before_action :set_user, only: [:show, :edit, :update, :destroy, :page, :liked, :disliked]

	def show
		page false
		liked false
		disliked false
	end

	def page (do_render = true)
		@policies = @user.policies.page(params[:page] || 1)
		if do_render
			render template: 'users/_policies', locals: {policies: @policies}
		end
	end

	def liked (do_render = true)
		@liked = @user.get_up_voted(Policy).page(params[:page] || 1)
		if do_render
			render template: 'users/_liked', locals: {liked: @liked}
		end
	end

	def disliked (do_render = true)
		@disliked = @user.get_down_voted(Policy).page(params[:page] || 1)
		if do_render
			render template: 'users/_disliked', locals: {disliked: @disliked}
		end
	end

	def create
		@user = User.new(user_params)
		if @user.save
			# Log in user automatically
			render json: AuthController.login_response(@user)
		else
			render json: process_errors(@user), status: :unprocessable_entity
		end
	end

	def update
		if params[:file]
			@user.avatar = params[:file]
		end
		
		if @user.update(user_params)
			render json: {avatar: @user.avatar_path}
		else
			render json: process_errors(@user), status: :unprocessable_entity
		end
	end

	def destroy
		@user.destroy
		head :ok
	end

	private

		def set_user
			@user = User.find(params[:id])
		end

		def enforce_current_user
			if @current_user.id != params[:id].to_i
				fail ForbiddenError
			end
		end

		def user_params
			params.require(:user).permit(:username, :email, :password, :avatar)
		end
end
