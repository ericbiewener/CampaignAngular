json.top_policies do |json|
	json.array!(top_policies) do |policy|
		json.extract! policy, :id, :title, :cached_votes_score
	end
end