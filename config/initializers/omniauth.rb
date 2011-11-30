Rails.application.config.middleware.use OmniAuth::Builder do
  provider :identity, :fields => [:name,:email], :on_failed_registration => SessionsController.action(:signup_failure)
  Settings.authnets.each_pair do |name, d|
    provider name, d['token'], d['secret']
  end
end
