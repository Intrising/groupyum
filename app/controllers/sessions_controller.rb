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
      flash[:type] = "warning"
      flash[:notice] = "Please enter your email address.!"
      render 'users/edit'
    else
      flash[:type] = "success"
      flash[:notice] = "Signed in!"
      redirect_to root_url
    end
  end
  def destroy
    reset_session
    flash[:type] = "success"
    flash[:notice] = "Sign Out!"
    redirect_to root_url
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
    flash[:type] = "error"
    flash[:notice] = "Authentication error: #{params[:message].humanize}"
    redirect_to :back
  end
  def signup_failure
    flash[:type] = "error"
    flash[:notice] = "The Email account is existed!"
    redirect_to :back
  end
end
