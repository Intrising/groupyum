require 'rake'
namespace :db do
	desc 'import dinbendon shop database from python mar into Dbdshop model'
	task :dbdimport => :environment do
		require 'rmarshal'
		require 'open-uri'
		marfn = 'http://db.tt/daa62yuE'
		puts 'opening remote marshal file'
		fp = open marfn
		puts 'loading the marshal file'
		hdata = unmarshal fp
		puts "unmarshal done.  There are #{hdata.count} records"
		Dbdshop.destroy_all
		hdata.each do |h| 
			s=Dbdshop.new( h)
			s.save!
			puts "#{h['name']} saved"
		end
	end
end
