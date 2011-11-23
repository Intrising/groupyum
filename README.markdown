This is source code of [groupyum](http://groupyum.com)

## Install

  * You need install *Ruby 1.9.2*, *Rubygems* and *Rails 3.1* first.
  * Install *MongoDb*
  * Install all gems in Gemfile via ``gem install``
  
  ```
  cp config/config.yml.default config/config.yml
  cp config/mongoid.yml.default config/mongoid.yml
  bundle install
  rake db:seed
  ```
  
## Deploy 

  ```
  $ cap deploy
  ```

