namespace :build do

  desc "Rebuild just the templates, no CSS or JS"
  task :templates do
    `jammit && git checkout public/assets/*.gz && git checkout public/assets/*.css && git checkout public/assets/viewer.js`
  end

end
