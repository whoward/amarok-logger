
namespace :make do
  
  desc "creates the tarfile for the plugin"
  task :tarball do
    `tar -czf amaroklogger.amarokscript.tar.gz logger/*`
  end
  
  desc "creates the documentation for the plugin - requires Java to be installed"
  task :doc do
    # if "which java" returns a blank string let the user know to add it and bail
    if `which java`.strip.empty?
      puts "java does not appear to be on the PATH, please add it."
      return
    end
    
    root = File.dirname(__FILE__)
    
    files = Dir["#{root}/logger/**/*.js"].reject! {|x| x =~ /www/ }
    
    rhino_jar = "#{root}/vendor/jsdoc-toolkit/jsrun.jar"
    jsdoc_js  = "#{root}/vendor/jsdoc-toolkit/app/run.js"
    template  = "#{root}/vendor/jsdoc-toolkit/templates/jsdoc"
    output    = "#{root}/doc"
    
    options = []
    
    options.push "--allfunctions"
    options.push "--template=#{template}"
    options.push "--private"
    options.push "--directory=#{output}"
    
    FileUtils.mkdir_p(output)
    
    system "java -jar #{rhino_jar} #{jsdoc_js} #{options.join(" ")} #{files.join(" ")}"
  end
  
end