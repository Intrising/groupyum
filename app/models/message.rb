class Message
  include Mongoid::Document
  belongs_to :sender, :class_name =>'User', :inverse_of=>:sent_messages
  belongs_to :recipient, :class_name =>'User', :inverse_of=>:received_messages
  field :sender_deleted, :type=>Boolean, :default =>false
  field :recipient_deleted, :type=>Boolean, :default =>false
  field :subject, :type=>String
  field :body, :type=>String
  field :created_at, :type=>DateTime
  field :read_at, :type=>DateTime
  attr_accessor :to    #to access recipient.name in form
  before_save :set_created_at

  def send_notification
    self.sender= User.sysadmin
    self.subject = "[notification] " + self.subject
    self.save!
  end

  def set_created_at
    self.created_at = Time.now
  end
  # Ensures the passed user is either the sender or the recipient then returns the message.  If the reader is the recipient and the message has yet not been read, it marks the read_at timestamp.
  def self.read(id, reader)
    message = find(id)
    if message.read_at.nil? && reader == message.recipient
      message.read_at = Time.now
      message.save!
    end
    message
  end

  # Returns true or false value based on whether the a message has been read by it's recipient.
  def read?
    self.read_at.nil? ? false : true
  end

  # Marks a message as deleted by either the sender or the recipient, which ever the user that was passed is.  Once both have marked it deleted, it is destroyed.
  def mark_deleted(user)
    self.sender_deleted = true if self.sender == user
    self.recipient_deleted = true if self.recipient == user
    self.sender_deleted && self.recipient_deleted ? self.destroy : save!
  end
end
