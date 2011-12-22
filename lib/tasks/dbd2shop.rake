require 'rake'

namespace :db do
	desc 'convert dbdshop to shop'
	task :dbd2shop => :environment do
		def new_option( odata)
			option =Option.new( odata)
			#option.is_default?
			option
		end
		def new_question( variants)
			#dinbendon has only one 'choice' question for each dish
			question = Question.new( :desc=>'kind', :type=>:choice)
			for variant in variants do
				question.options << new_option( variant)
			end
			question
		end
		def new_dish( dishdata)
  			#field :capword
			dish = Dish.new( :name=>dishdata['name'])
			variants = dishdata['variants']
			if variants.count>1
				#dinbendon has only one question
				dish.questions << new_question( variants)
			end
			#use dinbendon's first variant price as bprice
			dish.bprice = variants[0]['price']
			dish
		end
		def new_category( catedata)
			category = Category.new( :name=>catedata['name'])
			category.name= 'nocate' if category.name=='all'
			for dishdata in catedata['foods'] do
				category.dishes << new_dish(  dishdata)
			end
			category
		end

		Shop.destroy_all
		puts "total dbd shops = #{Dbdshop.count}"
		puts "total shops = #{Shop.count}"
		for dbdshop in Dbdshop.all do
			puts dbdshop.name
			rsd = dbdshop.as_document
			rsd.delete( '_id')
			foodcates = rsd.delete( 'foodcates')
			shop = Shop.new( rsd)
			for catedata in foodcates do
				shop.categories << new_category( catedata)
			end
			begin
				shop.save!
			rescue
				print "An error occurred: ",$!, "\n"
			end
		end
	end
end
