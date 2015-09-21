json.disliked do |json|
	json.array!(disliked) do |policy|
		json.extract! policy, :id, :title, :cached_votes_score
	end
end