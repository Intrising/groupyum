class Group
  include Mongoid::Document
  field :name, :type => String
  field :tel, :type => String
  field :dest_address, :type => String
  field :image, :type => String
  belongs_to :admin, :class_name=>'User', :inverse_of=>:created_groups
  has_and_belongs_to_many :members, :class_name=>'User', :inverse_of=>:joined_groups
  def has_user?( user)
    #user.ingroup?(self)
    self.admin == user or self.members.include?(user)
  end
  
  def add_member( user)
    self.members.push user
  end

  def del_member( user)
    self.members.delete user
  end
end
