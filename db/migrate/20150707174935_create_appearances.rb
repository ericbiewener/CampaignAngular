class CreateAppearances < ActiveRecord::Migration
  def change
    create_table :appearances do |t|
      t.text :properties
      t.references :user, index: true
    end
    add_foreign_key :appearances, :users
  end
end
