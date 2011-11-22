Rails.application.config.middleware.use OmniAuth::Builder do
  provider :identity, :fields => [:email]
  Settings.authnets.each_pair do |name, d|
    provider name, d['token'], d['secret']
  end
end
