class ApplicationMailer < ActionMailer::Base
	default from: 'Eric Biewener <ebiewener.devmailing@gmail.com>'
	layout 'mailer'

	def reset_password_email(user)
		@user = User.find(user.id)

		# Default Sorcery method for non-single page apps
		# @url  = edit_password_reset_url(@user.reset_password_token)

		@url  = 'https://' + Rails.application.routes.default_url_options[:host] + '/#/password-reset/' +	@user.reset_password_token
		
		result = mail(:to => user.email, :subject => "Reset your password")
	end
end