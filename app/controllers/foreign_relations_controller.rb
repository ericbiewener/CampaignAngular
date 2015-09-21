class ForeignRelationsController < ApplicationController

	before_action :enforce_current_user, only: [:show]

	def vote
		@country = Country.find(params[:id])

		if params[:toggle]
			@country.vote_by(voter: @current_user, vote: params[:vote])
			user_vote = params[:vote] == 1
		elsif params[:vote]
			@country.unliked_by @current_user
			user_vote = nil
		else
			@country.undisliked_by @current_user
			user_vote = nil
		end
		head :ok
	end

	def index
		@countries = Country.pluck(:id, :cached_votes_score)
		render json: @countries
	end

	def show
		@user = User.find(params[:id]);
		# @TODO: not efficient to split these up into two separate queries
		# -- Acts as votable doesn't seem to have a method for grabbing all at once, and get_voted() doesn't supply HOW the user voted
		# -- Posted to github: https://goo.gl/5moyDf
		@friends = @user.get_up_voted(Country)
		@foes = @user.get_down_voted(Country)
	end

	private

		def enforce_current_user
			if @current_user.id != params[:id].to_i
				fail ForbiddenError
			end
		end

end
