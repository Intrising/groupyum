class UsersController < ApplicationController
  before_filter :authenticate_user!
  before_filter :correct_user?
  def index
    @users = User.all
  end
  def show
    render :edit
    #@user = User.find(params[:id])
  end
  def edit
    @user = User.find(params[:id])
  end
  def update
    logger.info(params.inspect)
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      redirect_to root_url, :notice => 'The Email account is success!'
      #render 'users/edit', :notice => 'The Email account is success!'
      #redirect_to @user
    else
      render :edit
    end
  end
end
