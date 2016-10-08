# Allows running different seed files in /db/seeds via
# rake db:seed:seed_file_name [no .rb extension]
# 
# http://stackoverflow.com/questions/19872271/adding-a-custom-seed-file

namespace :db do
  namespace :seed do
    Dir[File.join(Rails.root, 'db', 'seeds', '*.rb')].each do |filename|
      task_name = File.basename(filename, '.rb').intern    
      task task_name => :environment do
        load(filename) if File.exist?(filename)
      end
    end
  end
end