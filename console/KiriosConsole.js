/*
      TODO:
      - overflow x
      - follow/lock console
    */
   var KiriosConsole: any = {};

   KiriosConsole.open = true;
   KiriosConsole.show = function (options) {

     //options.position = top-left, top-right, bl, br
     //options.minimized = false
   };
   KiriosConsole.minimize = function () {
     this.elements.console.classList.add("minimized");
     this.open = false;
   };

   KiriosConsole.maximize = function () {
     this.elements.console.classList.remove("minimized");
     this.open = true;
   };

   KiriosConsole.toggle = function () {
     this.open = !this.open;
     if (this.open)
       this.maximize();
     else
       this.minimize();
   };

   KiriosConsole.clear = function () {
     if (confirm("Are you sure you want to clear?"))
       this.elements.logs.innerHTML = "";
   };

   KiriosConsole.toggleFollow = function () {

   };

   KiriosConsole.copy = function () {
     KiriosHelper.copy(this.elements.logs.innerHTML);
   };

   KiriosConsole.download = function () {
     var date = (new Date() as any).yyyymmddhhmm();
     date = date.substring(0, 8) + "_" + date.substring(8,12);
     var filename = "console_" +  date + ".txt"
     KiriosHelper.download(filename, this.elements.logs.innerHTML);
   };

   KiriosConsole.log = function (message) {
     this.elements.logs.append(message + "\r\n");
   };

   KiriosConsole.error = function (message) {

   };

   KiriosConsole.elements = {
     height: 350,
     width: 700,
     load: function () {
       this.console = document.getElementById("console");
       this.header = document.getElementById("consoleHeader");
       this.body = document.getElementById("consoleBody");
       this.footer = document.getElementById("consoleFooter");
       this.logs = document.getElementById("consoleLogs");

     },
     resizeConsole: function (width, height) {
       this.console.style.width = width + "px";
       this.console.style.height = height + "px";
     }
   };

   var elem = document.createElement('div');
   //document.body.appendChild(elem);
   KiriosConsole.elements.load();
   window.KiriosConsole = KiriosConsole;


   