class CreatePolicies < ActiveRecord::Migration
	def change
		create_table :policies do |t|
			t.string :title
			t.text :description
			t.string :area
			t.references :user, index: true
			t.datetime :created_at
			t.integer :cached_votes_score, :default => 0
		end
		add_foreign_key :policies, :users
		add_index  :policies, :cached_votes_score
	end
end
