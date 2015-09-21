class User < ActiveRecord::Base
	authenticates_with_sorcery!
	acts_as_voter

	has_many :policies
	has_many :comments
	has_one :appearance

	mount_uploader :avatar, AvatarUploader

	# username format is alphanumeric, and MUST contain at least one letter
	validates :username, 	length: { within: 3..25 },
												format: /\A(?=.*[a-z])[a-z\d]+\Z/i,
												uniqueness: true

	validates :email, 		presence: true,
												format: /@/,
												uniqueness: true

	validates :password, 	presence: true, confirmation: false,
												on: :create

	def avatar_path
		if avatar.path
			ENV.fetch('CLOUDFRONT_DOMAIN') + avatar.path
		end
	end
	
end