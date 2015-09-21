class NotAuthenticatedError < StandardError
end
class AuthTokenExpired < StandardError
end
class ForbiddenError < StandardError
end
class PasswordResetTokenInvalid < StandardError
end

class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.

	# protect_from_forgery with: :exception
	# skip_before_filter :verify_authenticity_token # 

	before_action :authenticate_request
	before_action :set_default_response_format_to_json

	# Authentication Errors

	rescue_from NotAuthenticatedError do
		head 401
	end
	rescue_from AuthTokenExpired do
		head 419 # unofficial timeout status code
	end
	rescue_from ForbiddenError do
		head 403
	end
	rescue_from PasswordResetTokenInvalid do
		head 418 # unofficial
	end

	# Bad Request errors

	rescue_from ActiveRecord::RecordNotFound do |exception|
		render json: {error: exception.message}, :status => :not_found
	end

	rescue_from ActionController::ParameterMissing do |exception|
		render json: {exception.param => "is required"}, status: 422
	end

	private

		def set_default_response_format_to_json			
			request.format = :json
		end
		
		def process_errors(record)
			# Only return the first error for each field, since additional messages will generally be extraneous
			# e.g. "Email can't be blank" & "Email is invalid"
			errors = {}
			record.errors.messages.each do |k, v|
				errors[k] = v[0]
			end
			errors
		end

		# Permission Checking

		def set_current_user (throw_expiration_error = false)
			if decoded_auth_token(throw_expiration_error)
				@current_user ||= User.find(decoded_auth_token['user_id'])
			end
		end

		# JWT Authentication

		def authenticate_request
			if !set_current_user(true)
				fail NotAuthenticatedError
			end
		end

		def decoded_auth_token (throw_expiration_error = true)
			if @decoded_auth_token
				@decoded_auth_token
			else
				@decoded_auth_token = JWT.decode(http_auth_header_content, ENV.fetch('secret_key_base'))[0]
			end
			rescue JWT::ExpiredSignature
				if throw_expiration_error
					fail AuthTokenExpired
				else
					nil
				end
			rescue JWT::VerificationError, JWT::DecodeError
				nil
		end

		# JWT's are stored in the Authorization header using this format:
		# Bearer somerandomstring.encoded-payload.anotherrandomstring
		def http_auth_header_content
			return @http_auth_header_content if defined? @http_auth_header_content
			@http_auth_header_content = begin
				if request.headers['Authorization'].present?
					request.headers['Authorization'].split(' ').last
				else
					nil
				end
			end
		end

		
end


