class User
  include Mongoid::Document
  field :provider, :type => String
  field :uid, :type => String
  field :name, :type => String
  field :email, :type => String
  field :password, :type => String
  field :image, :type => String
  field :fullinfo, :type => Hash
  attr_protected :provider, :uid, :name, :email, :password, :image, :fullinfo
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['info']
        user.name = auth['info']['name'] || ""
        user.email = auth['info']['email'] || ""
        user.image = auth['info']['image'] || ""
        user.image = auth['info']['password'] || ""
        user.fullinfo = auth['info']
      end
    end
  end

end
