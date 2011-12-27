class Shop
  include Mongoid::Document
  field :name
  field :address
  field :email
  field :image
  embeds_many :categories

  validates :name, :presence => true, :uniqueness => {:case_sensitive => false}
  accepts_nested_attributes_for :categories, :reject_if => :all_blank, :allow_destroy => true
  def dishes
    #for cate in self.categories
    #  cate.dishes
    self.categories.find_or_create_by( :name=>'nocate').dishes
  end
end

class Category
  include Mongoid::Document
  field :name
  embedded_in :shop
  embeds_many :dishes
  accepts_nested_attributes_for :dishes, :reject_if => :all_blank, :allow_destroy => true
end

class Dish
  include Mongoid::Document
  field :name
  field :bprice
  field :capword
  embedded_in :category
  embeds_many :questions
  accepts_nested_attributes_for :questions, :reject_if => :all_blank, :allow_destroy => true
end

class Question
  include Mongoid::Document
  field :desc
  field :type
  embedded_in :dish
  embeds_many :options
  accepts_nested_attributes_for :options, :reject_if => :all_blank, :allow_destroy => true
end

class Option
  include Mongoid::Document
  field :desc
  field :price
  field :is_default?, :type=>Boolean
  embedded_in :question
end

