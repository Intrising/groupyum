require 'rake'

namespace :db do
	desc 'import rawshop to shop'
	task :raw2shop => :environment do
		puts "totals shops = #{Rawshop.count}"
	end
end
