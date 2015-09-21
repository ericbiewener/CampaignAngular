json.liked do |json|
	json.array!(liked) do |policy|
		json.extract! policy, :id, :title, :cached_votes_score
	end
end