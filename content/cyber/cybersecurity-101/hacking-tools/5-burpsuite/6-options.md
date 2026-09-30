Before diving into the Burp Proxy, let's explore the available options for configuring Burp Suite. There are two types of settings: Global settings (also known as User settings) and Project settings.

- **Global Settings**: These settings affect the entire Burp Suite installation and are applied every time you start the application. They provide a baseline configuration for your Burp Suite environment.
    
- **Project Settings**: These settings are specific to the current project and apply only during the session. However, please note that Burp Suite Community Edition does not support saving projects, so any project-specific options will be lost when you close Burp.
    
    To access the settings, click on the **Settings** button in the top navigation bar. This will open a separate settings window.
    
    ![Settings button to open the separate settings window](https://tryhackme-images.s3.amazonaws.com/user-uploads/5d9e176315f8850e719252ed/room-content/40a3ea01d6eadc91d98499c3f921c90f.png)
    
    Below is the image showing the separate settings window.
    
    ![Separate settings window](https://tryhackme-images.s3.amazonaws.com/user-uploads/5d9e176315f8850e719252ed/room-content/8a6df0ac968a5c33e91903b350253b6b.png)
    

In the Settings window, you will find a menu on the left-hand side. This menu allows you to switch between different types of settings, including:

1. **Search**: Enables searching for specific settings using keywords.
2. **Type filter**: Filters the settings for **User** and **Project** options.
    - **User settings**: Shows settings that affect the entire Burp Suite installation.
    - **Project settings**: Displays settings specific to the current project.
3. **Categories**: Allows selecting settings by category.

![Project settings button](https://tryhackme-images.s3.amazonaws.com/user-uploads/645b19f5d5848d004ab9c9e2/room-content/04cf1a4164616772d9495a3ee2bfd10a.png)  

It's worth noting that many tools within Burp Suite provide shortcuts to specific categories of settings. For example, the **Proxy** module includes a **Proxy settings** button that opens the settings window directly to the relevant proxy section.

![Proxy settings button that opens the settings window directly to the
relevant proxy section](https://tryhackme-images.s3.amazonaws.com/user-uploads/5d9e176315f8850e719252ed/room-content/09211709d4034aa42ce403780ca12ba0.png)

The search feature on the settings page is a valuable addition, allowing you to quickly search for settings using keywords.

Take some time to familiarise yourself with the range of configurable options in Burp Suite. Once you are comfortable, you can proceed with the exercises related to configuring Burp Suite settings.

---
### Theory Questions
=> n which category can you find a reference to a "Cookie jar"?
==> Sessions

=> In which base category can you find the "Updates" sub-category, which controls the Burp Suite update behaviour?
==> suite

=> What is the name of the sub-category which allows you to change the keybindings for shortcuts in Burp Suite?
==> Hotkeys

-> If we have uploaded Client-Side TLS certificates, can we override these on a per-project basis (yea/nay)?
==> yea
