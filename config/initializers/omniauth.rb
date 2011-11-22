Rails.application.config.middleware.use OmniAuth::Builder do
  provider :identity, :fields => [:email]
  provider :facebook, Settings.facebook_token, Settings.facebook_secret
  provider :twitter, Settings.twitter_token, Settings.twitter_secret
  provider :weibo, Settings.weibo_token, Settings.weibo_secret
end
