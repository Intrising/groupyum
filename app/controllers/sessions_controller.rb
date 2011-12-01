class SessionsController < ApplicationController
  def register_new_user( auth)
    user=User.create_with_omniauth(auth)
    if user.provider == 'identity'
      UserMailer.confirm( user).deliver
    end
    user
  end

  def create
    auth = request.env["omniauth.auth"]
    @user = User.where(:provider => auth['provider'], :uid => auth['uid']).first || self.register_new_user( auth)
    session[:user_id] = @user.id
    if @user.email.empty? || @user.email.blank?
      render 'users/edit', :notice => 'Please enter your email address.'
    else
      redirect_to root_url, :notice => "Signed in!"
    end
  end
  def destroy
    reset_session
    redirect_to root_url, :notice => 'Signed out!'
  end
  def show_providers
    @signinlinks = {
      :email =>'/auth/identity',
    }
    Settings.authnets.each_key do |k|
      @signinlinks[k] = "/auth/#{k}"
    end
  end
  def failure
    redirect_to :back, :notice => "Authentication error: #{params[:message].humanize}"
  end
  def signup_failure
    redirect_to :back, :notice => "The Email account is existed!"
  end
end
