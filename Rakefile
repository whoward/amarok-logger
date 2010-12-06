
namespace :make do
  
  desc "creates the tarfile for the plugin"
  task :tarball do
    `tar -czf amaroklogger.amarokscript.tar.gz logger/*`
  end
  
  desc "creates the documentation for the plugin"
  task :doc do
    # if "which java" returns a blank string let the user know to add it and bail
    if `which java`.strip.empty?
      puts "java does not appear to be on the PATH, please add it."
      return
    end
    
    # get the directory this rakefile is defined in
    root = File.dirname(__FILE__)
    
    # get a list of all javascript files that are not in the www directoy
    files = Dir["#{root}/logger/**/*.js"].reject! {|x| x =~ /www/ }
    
    # start building up arguments to the system call
    rhino_jar = "#{root}/vendor/jsdoc-toolkit/jsrun.jar"
    jsdoc_js  = "#{root}/vendor/jsdoc-toolkit/app/run.js"
    template  = "#{root}/vendor/jsdoc-toolkit/templates/jsdoc"
    output    = "#{root}/doc"
    
    options = []
    
    options.push "--allfunctions"
    options.push "--template=#{template}"
    options.push "--private"
    options.push "--directory=#{output}"
    
    # make the output directory
    FileUtils.mkdir_p(output)
    
    # make the system call
    system "java -jar #{rhino_jar} #{jsdoc_js} #{options.join(" ")} #{files.join(" ")}"
  end
  
end

desc "runs javascript lint on all the files"
task :lint do
    # if "which java" returns a blank string let the user know to add it and bail
    if `which java`.strip.empty?
      puts "java does not appear to be on the PATH, please add it."
      return
    end
    
    # get the directory this rakefile is defined in
    root = File.dirname(__FILE__)
    
    # get a list of all javascript files that are not in the www directoy
    files = Dir["#{root}/logger/**/*.js"].reject! {|x| x =~ /www/ }

    # start building up arguments to the system call
    rhino_jar = "#{root}/vendor/jsdoc-toolkit/jsrun.jar"
    jslint_js = "#{root}/vendor/jslint/jslint-rhino.js"
    
    # run through each file running lint on it, only display results if the
    # call was unsuccessful
    files.each do |file|
      result = `java -jar #{rhino_jar} #{jslint_js} #{file}`
      
      next if $?.success?
      
      basename = File.basename(file)
      
      puts "### #{basename} #{'#' * (75 - basename.length)}"
      puts result
      puts
    end
end