json.policies do |json|
	json.array!(@policies) do |policy|
		json.partial! 'policy', policy: policy
	end
end

# @top_policies won't exist when simply requesting the next page of main @policies results
if @top_policies
	json.partial! 'top_policies', top_policies: @top_policies
end