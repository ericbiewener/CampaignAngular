json.array!(@comments) do |comment|
	json.(comment, :text, :created_at)
	json.user do |json|
		json.(comment.user, :id, :username, :avatar)
		json.avatar(comment.user.avatar_path)
	end
end
