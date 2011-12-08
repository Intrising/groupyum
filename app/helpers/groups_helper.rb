# coding: utf-8  
module GroupsHelper
  def admin?
    @group.admin==@user
  end  
  def editable?
    @group.admin==@user
  end
end
