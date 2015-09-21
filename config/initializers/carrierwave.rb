CarrierWave.configure do |config|
	# config.storage    = :aws
	config.fog_directory = ENV.fetch('FOG_DIRECTORY')
	# config.aws_acl    = 'public-read'

	# The maximum period for authenticated_urls is only 7 days.
	# config.aws_authenticated_url_expiration = 60 * 60 * 24 * 7

	# Set custom options such as cache control to leverage browser caching
	# config.aws_attributes = {
	# 	expires: 1.week.from_now.httpdate,
	# 	cache_control: 'max-age=604800'
	# }

	config.fog_credentials = {
		provider: 'AWS',
		aws_access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID'),
		aws_secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY'),
		region: ENV.fetch('FOG_REGION')
	}
end