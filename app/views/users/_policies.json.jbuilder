json.policies do |json|
	json.array!(policies) do |policy|
		json.extract! policy, :id, :title, :cached_votes_score
	end
end