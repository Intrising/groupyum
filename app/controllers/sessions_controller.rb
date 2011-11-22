class SessionsController < ApplicationController
  def create
    #raise request.env["omniauth.auth"].to_yaml
    auth = request.env["omniauth.auth"]
    user = User.where(:provider => auth['provider'], :uid => auth['uid']).first || User.create_with_omniauth(auth)
    session[:user_id] = user.id
    if !user.email
      redirect_to edit_user_path(user), :alert => 'Please enter your email address.'
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
    redirect_to root_url, :alert => "Authentication error: #{params[:message].humanize}"
  end
end
