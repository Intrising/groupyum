Rails.application.config.middleware.use OmniAuth::Builder do
  provider :identity, :fields => [:email]
  provider :facebook, Settings.facebook_token, Settings.facebook_secret if  Settings['facebook_token'].present?
  provider :twitter, Settings.twitter_token, Settings.twitter_secret if Settings['twitter_token'].present? 
  provider :weibo, Settings.weibo_token, Settings.weibo_secret if Settings['weibo_token'].present?
end
