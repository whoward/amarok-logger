# Description

This plugin has been written so that Amarok plugin writers can have a shared
logging window to display output from their plugins in.  

Now you don't have to run Amarok in debug mode and look between huge spaces of 
Amarok's own debug output to find your own plugin's output!

This logger currently supports at least three output modes to the console:
  - log: timestamped output messages
  - notification: output messages without timestamps
  - error: output messages without timestamps that are shown with emphasis  

On top of that the logger is easily themeable - only requiring a CSS stylesheet
to create a new one.  It comes with two themes already: basic and coffee.

# Installation and Usage

Enough of that - how do you use it in your plugins?

1. make sure qtscript bindings for the core, gui, network and webkit modules
are installed.  In Ubuntu/Kubuntu that means installing the following packages:
  `libqtscript4-core libqtscript4-gui libqtscript4-network libqtscript4-webkit`
2. start by installing this plugin (naturally)
3. add logger_client.js to your own plugin project
4. call methods on the logger object - see the example below.
5. In Amarok select from the menu Tools -> Display Script Log

Finally you should see your output !

## Calling methods on the logger client object:
    Logger = new LoggerClient();
    Logger.log("Starting up the new plugin!");
    Logger.notify("This is a notification style message");
    Logger.error("Something went wrong!");

# Living on the EDGE
In other words - if you want to use the HEAD version of the master branch
(which may be unstable) you can simple clone this repository then run the
following command line to generate the Amarok installable archive:

    rake make:tarball

You will of course need to have Rake installed, which should be in most people's
package repositories regardless :)

# Reporting Errors / Feature Requests
Please open a ticket at http://github.com/whoward/amarok-logger/issues

# Contributing
Fork my project (ideally on github please) and send me a pull request with
the details of your changes. 
