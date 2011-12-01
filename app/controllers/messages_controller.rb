class MessagesController < ApplicationController
  before_filter :set_user
  def index
    if params[:mailbox] == "sent"
      @messages = @user.sent_messages
    else
      @messages = @user.received_messages
    end
  end
  
  def show
    @message = Message.read(params[:id], current_user)
  end
  
  def new
    @message = Message.new
    if params[:reply_to]
      @reply_to = @user.received_messages.find(params[:reply_to])
      unless @reply_to.nil?
        @message.to = @reply_to.sender.name
        @message.subject = "Re: #{@reply_to.subject}"
        @message.body = "\n\n*Original message*\n\n #{@reply_to.body}"
      end
    end
  end
  
  def create
    @message = Message.new(params[:message])
    @message.sender = @user
    @message.recipient = User.first( :conditions=> {:name=>params[:message][:to]})
    if @message.save
      flash[:success] = "Message sent!"
      redirect_to messages_path
    else
      render :action => :new
    end
  end
  
  def delete_selected
    if request.post?
      if params[:delete]
        ndmsgs=params[:delete].count
        params[:delete].each { |id|
          @message = Message.find(id)
          @message.mark_deleted(@user) unless @message.nil?
        }
        flash[:success] = "#{ndmsgs} Messages deleted!"
      end
      redirect_to :back
    end
  end
  
  private
    def set_user
      @user = current_user
    end
end
