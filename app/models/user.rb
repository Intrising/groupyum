class User
  include Mongoid::Document
  field :provider, :type => String
  field :uid, :type => String
  field :name, :type => String
  field :email, :type => String
  field :image, :type => String
  field :enabled, :type => Boolean, :default=>true
  field :fullinfo, :type => Hash 
  attr_protected :provider, :uid, :password, :fullinfo
  has_many :sent_messages, :class_name=>'Message', :inverse_of=>:sender
  has_many :received_messages, :class_name=>'Message', :inverse_of=>:recipient
  #TODO: study how to add the follow modifiers in mongoid.
  #:order => "#{table_name}.created_at DESC",
  #:conditions => ["#{table_name}.sender_deleted = ?", false]

  def self.sysadmin
    User.find_or_create_by :name=>'sysadmin', :email=>'donotreply@groupyum.com', :provider=>'identity'
  end
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      user.enabled = false if user.provider == 'identity'
      if auth['info']
        user.name = auth['info']['name'] || ""
        user.email = auth['info']['email'] || ""
        user.image = auth['info']['image'] || ""
        user.fullinfo = auth['info']
      end
    end
  end

  def unread_messages?
    self.unread_message_count > 0 ? true : false
  end

  def unread_message_count
    urmsg_count = 0
    self.received_messages.each do |msg|
      urmsg_count += 1 if msg.read_at.nil? 
    end
    urmsg_count
    #self.received_messages.count( :conditions=>{ :read_at=>nil})
  end
  has_many :created_groups, :class_name=>'Group', :inverse_of=>:admin
  has_and_belongs_to_many :joined_groups, :class_name=>'Group', :inverse_of=>:members
  def ingroup?( group)
    self.created_groups.include?(group) or self.joined_groups.include?(group)
  end
end
