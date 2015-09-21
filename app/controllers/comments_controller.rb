class CommentsController < ApplicationController
	skip_before_filter :authenticate_request, only: [:all]
	
	def all
		@comments = Comment.where(policy_id: params[:policy_id]).reorder('created_at asc')
	end

	def create
		@comment = Comment.new(comment_params)
		@comment.user = @current_user
		@comment.policy = Policy.find(params[:policy_id])
		if @comment.save
			@comments = [@comment] # all expects an array
			render :all
		else
			render json: @comment.errors, status: :unprocessable_entity
		end
	end

	private

		def comment_params
			params.require(:comment).permit(:text)
		end

end
