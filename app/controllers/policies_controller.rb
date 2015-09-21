class PoliciesController < ApplicationController

	before_action :set_policy, only: [:show, :edit, :update, :destroy, :vote]
	before_action :enforce_current_user, only: [:edit, :update, :destroy]

	def vote
		if @policy.user != @current_user
			if params[:toggle]
				@policy.vote_by(voter: @current_user, vote: params[:vote])
			elsif params[:vote]
				@policy.unliked_by @current_user
			else
				@policy.undisliked_by @current_user
			end
			head :ok
		else
			head status: 403
		end
	end

	def index
		pg = params[:page] || 1

		if !params[:area]
			@policies = Policy.page(pg)
		else
			@policies = Policy.where(area: params[:area]).page(pg)
		end

		# if page param is requested, we are loading more of the main results.
		if !params[:page] 
			popular 
		end
	end

	def popular
		if params[:type] == 'false'
			order = 'cached_votes_score asc'
			posNeg = 'cached_votes_score <= ?'
		else
			order = 'cached_votes_score desc'
			posNeg = 'cached_votes_score >= ?'
		end

		if !params[:area]
			@top_policies = Policy.reorder(order).page(1)
		else
			@top_policies = Policy.where(area: params[:area]).where(posNeg, 0).reorder(order).page(1)
		end
	end

	def create
		@policy = Policy.new(policy_params)
		@policy.user = @current_user
		if @policy.save
			render json: {id: @policy.id}, status: :created
		else
			render json: process_errors(@policy), status: :unprocessable_entity
		end
	end

	def update
		if @policy.update(policy_params)
			head :ok
		else
			render json: process_errors(@policy), status: :unprocessable_entity
		end
	end

	def destroy
		@policy.destroy
		head :ok
	end

	private
		def set_policy
			@policy = Policy.find(params[:id])
		end

		def enforce_current_user
			if @current_user.id != @policy.user.id
				fail ForbiddenError
			end
		end

		def policy_params
			params.require(:policy).permit(:title, :description, :area)
		end
end
