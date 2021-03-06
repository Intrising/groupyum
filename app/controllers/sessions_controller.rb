class SessionsController < ApplicationController
  def register_new_user( auth)
   user=User.create_with_omniauth(auth)
    if user.provider == 'identity'
      UserMailer.confirm(user).deliver
    end
    user
  end

  def create
    auth = request.env["omniauth.auth"]
    @user = User.where(:provider => auth['provider'], :uid => auth['uid']).first
    is_new_usr = @user.nil?
    if is_new_usr
      @user = self.register_new_user(auth)
    end
    session[:user_id] = @user.id
    if @user.email.empty? || @user.email.blank?
      flash[:type] = "warning"
      flash[:notice] = t(:flash_email_enter)
      render 'users/edit'
    else
      if !@user.enabled
        flash[:type] = "warning"
        flash[:notice] = t(:flash_email_confirm)
        redirect_to root_url and return
      elsif is_new_usr
        UserMailer.welcome(@user).deliver
      end
      flash[:type] = "success"
      flash[:notice] = t(:flash_signin)
      redirect_to root_url
    end
  end
  def destroy
    reset_session
    flash[:type] = "success"
    flash[:notice] = t(:flash_signout)
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
    flash[:notice] = t(:flash_auth_err, :desc => "#{params[:message].humanize}")
    redirect_to :back
  end
  def signup_failure
    flash[:type] = "error"
    flash[:notice] = t(:flash_email_existed)
    redirect_to :back
  end
end
