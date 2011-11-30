class Identity
  include Mongoid::Document
  include OmniAuth::Identity::Models::Mongoid

  field :email, type: String
  field :name, type: String
  field :password_digest, type: String
  validates :email, :uniqueness => { :case_sensitive => false }
end
