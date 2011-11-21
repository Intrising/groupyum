class User
  include Mongoid::Document
  field :provider, :type => String
  field :uid, :type => String
  field :name, :type => String
  field :email, :type => String
  field :password, :type => String
  attr_protected :provider, :uid, :name, :email
end
