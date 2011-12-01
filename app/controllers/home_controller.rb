class HomeController < ApplicationController
  def index
    @users = User.all
  end
  def register
  end
  def send_confirm
    @user = current_user
    UserMailer.confirm(@user).deliver
    render :text=>"confirm sent to #{@user.email}"
  end
  def activate
    userid = params[:actcode]
    user = User.find(userid)
    if user.nil? 
      redirect_to signin_path,  :alert=>'no such actcode.  Please login/register'
    else
      user.enabled = true
      user.save!
      cuser = current_user
      if cuser and cuser.email == user.email
        redirect_to edit_user_path(user), :notice=>"Your account has been activated."
      else
        redirect_to signin_path, :notice=>"Please relogin"
      end
    end
  end
  def test
    render :text=> "the email is #{current_user.email}"
  end
end
