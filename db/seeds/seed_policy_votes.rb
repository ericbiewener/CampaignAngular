module SeedPolicyVotes
	puts 'SeedPolicyVotes START'

	users = User.all
	policies = Policy.all

	10000.times do
		users.sample.likes policies.sample
	end

	10000.times do
		users.sample.dislikes policies.sample
	end

	puts 'SeedPolicyVotes END'
end