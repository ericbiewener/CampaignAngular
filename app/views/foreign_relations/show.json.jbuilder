json.friends @friends.each do |friend|
  json.(friend, :id, :name)
end

json.foes @foes.each do |foe|
  json.(foe, :id, :name)
end