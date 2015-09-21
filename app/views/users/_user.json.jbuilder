json.user do |json|
	json.extract! user, :id, :username, :email, :created_at
	json.avatar(user.avatar_path)
end