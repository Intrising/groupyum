class Shop
  include Mongoid::Document
  field :name
  field :address
  field :email
  field :image
  embeds_many :categories

  validates :name, :presence => true, :uniqueness => {:case_sensitive => false}
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
end

class Dish
  include Mongoid::Document
  field :name
  field :bprice
  field :capword
  embedded_in :category
  embeds_many :questions
end

class Question
  include Mongoid::Document
  field :desc
  field :type
  embedded_in :dish
  embeds_many :options
end

class Option
  include Mongoid::Document
  field :desc
  field :price
  field :is_default?, :type=>Boolean
  embedded_in :question
end

