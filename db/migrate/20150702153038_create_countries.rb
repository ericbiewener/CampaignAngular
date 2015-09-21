class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
    	t.string :name, null: false
    	t.integer :cached_votes_score, :default => 0

    	t.index :name
    end
  end
end
