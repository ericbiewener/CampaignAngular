class Appearance < ActiveRecord::Base
  belongs_to :user

  validates :properties, presence: true
end
