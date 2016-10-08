module SeedCountryVotes
	puts 'SeedCountryVotes START'

	users = User.all
	countries = Country.all

	# users.each do |user|
	# 	countries_shuffled = countries.shuffle
		
	# 	# Select 60-120 countries from the randomized array to like.
	# 	# Those items get removed from the array, so the remaining ones can be disliked.
	# 	rand(60...120).times do
	# 		user.likes countries_shuffled.delete_at(0)
	# 	end
		
	# 	countries_shuffled.each do |country|
	# 		user.dislikes country
	# 	end
	# end

	countries_shuffled = countries.shuffle

	80.times do

		country = countries_shuffled.delete_at(0)
		rand(5..15).times do
			users.sample.likes country
		end

	end

	30.times do
		
		country = countries_shuffled.delete_at(0)
		rand(5..15).times do
			users.sample.dislikes country
		end

	end

	puts 'SeedCountryVotes END'
end