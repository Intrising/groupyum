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
      flash[:type] = "error"
      flash[:notice] = "No such actcode. Please login/register!"
      redirect_to signin_path
    else
      user.enabled = true
      user.save!
      cuser = current_user
      if cuser and cuser.email == user.email
        flash[:type] = "success"
        flash[:notice] = "Your account has been activated!"
        redirect_to edit_user_path(user)
      else
        flash[:type] = "error"
        flash[:notice] = "Please relogin!"
        redirect_to signin_path
      end
    end
  end
  def test
    render :text=> "the email is #{current_user.email}"
  end
end
