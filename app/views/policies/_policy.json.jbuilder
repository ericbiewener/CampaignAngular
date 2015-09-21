json.(policy, :id, :title, :area, :cached_votes_score, :created_at)
json.description(simple_format(policy.description))

if current_user
	json.user_vote(current_user.voted_as_when_voted_for(policy))
	json.current_user_is_owner(policy.user.id == current_user.id)
end

json.user do |json|
	json.(policy.user, :id, :username)
	json.avatar(policy.user.avatar_path)
end

json.comments do |json|
	json.array!(policy.comments.page(1).reverse) do |comment|

		json.text(simple_format(comment.text))
		json.created_at(comment.created_at)

		json.user do |json|
			json.(comment.user, :id, :username)
			json.avatar(comment.user.avatar_path)
		end

	end
end

json.comment_count(policy.comments.count)