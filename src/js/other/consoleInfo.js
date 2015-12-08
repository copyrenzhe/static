    define("consoleInfo", [], function() {
        !function(t, e) {
            n = "color: #0f0; font-size: 1.5em; line-height: 3em; padding: 1em; background: rgba(10, 10, 10, 1);",
            e.info("%c喜欢研究我的代码，还是发现了什么bug？请告诉我吧~ :)", n),
            e.info("%cEmail: copyrenzhe@gmail.com", n),
            e.warn("%cCopyright © 2014 Triton Information. All rights reserved.", n + "color: #f50;");
        }
        (window, console)
    }
    )