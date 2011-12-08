class UserMailer < ActionMailer::Base
  default :from => Settings.email_sender
  default :charset => "utf-8"                                                   
  default :content_type => "text/html" 
  default_url_options[:host] = Settings.domain
  #include Resque::Mailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.confirm.subject
  #
  def confirm(user)
    @user = user
    mail( :to => @user.email, :subject => "Welcome to #{Settings.app_name}")
  end
  def welcome(user)
    @user = user
    mail( :to => @user.email, :subject => "Welcome to #{Settings.app_name}")
  end
  def request_join( user, group)
    @user = user
    @group = group
    subj= "[#{Settings.app_name}] user #{@user.name} requests to join group #{@group.name}"
    mail( :to => @group.admin.email, :subject =>subj )
  end

  def invite_join( user, group)
  end
end
