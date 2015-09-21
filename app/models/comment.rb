class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :policy

	validates :user,				presence: true
	validates :policy,			presence: true
	validates :text,				presence: true

	default_scope {order('created_at DESC')}
	paginates_per 2
end
