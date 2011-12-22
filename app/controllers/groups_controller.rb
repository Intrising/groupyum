class GroupsController < ApplicationController
  before_filter :find_user
  before_filter :find_group, :except => [:index, :new, :create, :mygroups]
  before_filter :check_editable, :only => [:edit, :update, :destroy]
  # GET /groups
  # GET /groups.json
  def index
    @groups = Group.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @groups }
    end
  end
  # GET /groups/1
  # GET /groups/1.json
  def show
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @group }
    end
  end

  # GET /groups/new
  # GET /groups/new.json
  def new
    @group = Group.new
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @group }
    end
  end

  # GET /groups/1/edit
  def edit
  end

  # POST /groups
  # POST /groups.json
  def create
    @group = Group.new(params[:group])
    @group.admin = @user
    respond_to do |format|
      if @group.save
        format.html { redirect_to @group, notice: 'Group was successfully created.' }
        format.json { render json: @group, status: :created, location: @group }
      else
        format.html { render action: "new" }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /groups/1
  # PUT /groups/1.json
  def update
    respond_to do |format|
      if @group.update_attributes(params[:group])
        format.html { redirect_to @group, notice: 'Group was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group.destroy
    respond_to do |format|
      format.html { redirect_to groups_url }
      format.json { head :ok }
    end
  end
  
  def invite_join( user)
    render :text=>"invite #{@user.name} to join #{@group.name}...not implement yet"
  end

  def request_join
    em=UserMailer.request_join( @user, @group)
    m = Message.new
    m.recipient = @user
    m.subject = em.subject
    m.body = em.body 
    m.send_notification
    em.deliver
    redirect_to group_url( @group), notice: "a requesting mail has been sent."
  end

  def add_member
    #TODO: check the auth token
    tuser = User.find( params[:user_id])
    @group.add_member( tuser)
    redirect_to group_url(@group), notice: "You've been successfully added to #{@group.name}"
  end

  def del_member
    tuser = User.find( params[:user_id])
    #TODO: check the auth token
    @group.del_member( tuser)
    redirect_to group_url(@group), notice: "You've been successfully removed from #{@group.name}"
  end

  def mygroups
    logger.info("mygroups:QQQQQQQQQQQQQQQ")
  end

  private
    def find_user
      @user = current_user
    end
    def find_group
      @group = Group.find( params[:id])
    end
    def check_editable
      redirect_to group_url(@group), :alert=>"admission wrong" if current_user != @group.admin
    end

end
