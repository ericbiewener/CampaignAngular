class Policy < ActiveRecord::Base

	acts_as_votable

	belongs_to :user
	has_many :comments, dependent: :destroy

	validates :user,				presence: true
	validates :title, 			presence: true
	validates :description, presence: true
	validates :area,		 		inclusion: { in: ['Economy',
																						'Health',
																						'Education',
																						'Environment',
																						'National Security',
																						'Space!']}


	attr_accessor :user_vote

	default_scope {order('created_at DESC')}

	paginates_per 10

end
