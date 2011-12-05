class UsersController < ApplicationController
  before_filter :authenticate_user!
  before_filter :correct_user?, :except => [:show]
  def index
    @users = User.all
  end
  def show
    @user = User.find(params[:id])
  end
  def edit
    @user = User.find(params[:id])
  end
  def update
    logger.info(params.inspect)
    @user = User.find(params[:id])
    is_new_usr = @user.email.empty? || @user.email.blank?
    if @user.update_attributes(params[:user])
      if is_new_usr
        UserMailer.welcome(@user).deliver
      end
      flash[:type] = "success"
      flash[:notice] = t(:flash_email_saved)
      redirect_to root_url
      #redirect_to @user
    else
      render :edit
    end
  end
end
