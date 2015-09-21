class AppearancesController < ApplicationController

	before_action :set_appearance

	def show
		if @appearance
			render json: @appearance.properties, status: :ok
		else
			head :ok
		end
	end

	def save
		if @appearance
			result = @appearance.update(appearance_params)
		else
			@appearance = Appearance.new(appearance_params)
			@appearance.user = @current_user
			result = @appearance.save
		end
			
		if result
			head :ok
		else
			render json: @appearance.errors, status: :unprocessable_entity
		end

	end

	private
		def set_appearance
			@appearance = @current_user.appearance
		end

		def appearance_params
			params.require(:appearance).permit(:properties)
		end

end
