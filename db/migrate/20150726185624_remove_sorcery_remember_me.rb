class RemoveSorceryRememberMe < ActiveRecord::Migration
  def up
  	remove_column :users, :remember_me_token
  	remove_column :users, :remember_me_token_expires_at
  end
  
  def down
    add_column :users, :remember_me_token, :string, :default => nil
    add_column :users, :remember_me_token_expires_at, :datetime, :default => nil

    add_index :users, :remember_me_token
  end

end
