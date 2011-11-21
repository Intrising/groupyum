This is source code of [grouphum](http://groupyum.com)

## Install

  * You need install *Ruby 1.9.2*, *Rubygems* and *Rails 3.1* first.
  * Install *MongoDb* 
  
  ```
  cp config/config.yml.default config/config.yml
  cp config/mongoid.yml.default config/mongoid.yml
  bundle install
  bundle update rails
  rake assets:precompile
  ```
  
## Deploy 

  ```
  $ cap deploy
  ```

