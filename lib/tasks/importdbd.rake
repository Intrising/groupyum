require 'rake'

desc 'import dinbendon shop database from python mar into Rawshop model'
task :importdbd => :environment do
	require 'rmarshal'
	require 'open-uri'
	marfn = 'http://db.tt/daa62yuE'
	puts 'opening remote marshal file'
	fp = File.open marfn
	puts 'loading the marshal file'
	hdata = unmarshal fp
	puts "unmarshal done.  There are #{hdata.count} records"
	Rawshop.destroy_all
	hdata.each do |h| 
		s=Rawshop.new( h)
		s.save!
		puts "#{h['name']} saved"
	end
end
