module SeedUserAvatars
	puts 'SeedUserAvatars START'

	users = User.all

	# Skip first user since it's the lead developer.
	for i in 1..users.length - 1
		users[i].avatar = File.open("#{Rails.root}/app/assets/images/avatar-seed/200_#{i}.jpg")
		users[i].save
	end
	
	puts 'SeedUserAvatars END'
end