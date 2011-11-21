Rails.application.config.middleware.use OmniAuth::Builder do
  provider :identity, :fields => [:email]
  provider :facebook, Setting.facebook_token, Setting.facebook_secret
  provider :twitter, Setting.twitter_token, Setting.twitter_secret
  provider :weibo, Setting.weibo_token, Setting.weibo_secret
end
