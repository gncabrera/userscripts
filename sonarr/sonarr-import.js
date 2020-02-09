// ==UserScript==
// @name        Sonarr Easier Manual Import
// @namespace   https://github.com/gncabrera
// @version     1.5.2
// @updateURL   https://raw.githubusercontent.com/gncabrera/userscripts/master/sonarr/sonarr-import.js
// @downloadURL https://raw.githubusercontent.com/gncabrera/userscripts/master/sonarr/sonarr-import.js
// @author      gncabrera
// @match       https://sonarr.kirios.com.ar/*
// @match       https://la.sonarr.kirios.com.ar/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    var SelectionManager = {};
    SelectionManager.checkAllValid = function() {
        console.log("valid");
        $(".has-series.has-season input[type=checkbox]").each(function() {
            $(this).click();
        });
    };

    SelectionManager.checkAllInvalid = function() {
        console.log("invalid");
        $(".manual-import-error input[type=checkbox]").each(function() {
            $(this).click();
        });
    };

    SelectionManager.toggleUnselected = function() {
        console.log("toggle unselected");
        $(".manual-import-row input:not(:checked)").each(function() {
            var $this = $(this);
            var $row = $this.parent().parent();
            $row.toggle();
        });
    };

    /* ========== ROW MANAGER ============= */

    var RowManager = {};

    /* ========== ROW FINDER ================== */
    RowManager.getRows = function() {
        var $rows = [];


        // Getting $rows
        $(".manual-import-row input:checked").each(function() {
            var $this = $(this);
            var $row = $this.parent().parent();
            $rows.push($row);

        });

        if($rows.length === 0) alert("Rows not selected");
        return $rows;
    };

    /* ========== SERIES HANDLING ============= */
    RowManager.series = {};

    RowManager.series.clickCell = function($row) {
        $row = $($row);
        $row.find(".series-title-cell").click();
    };
    RowManager.series.select = function(name) {
        var clicked = false;
        $(".select-series-row").each(function(){
            var $this = $(this);
            var text = $this.find("td").html();
            if(text.toLowerCase().includes(name.toLowerCase())) {
                $this.click();
                clicked = true;
                return false;
            }
        });
        if(!clicked) {
            FunctionManager.stop();
            alert("Series with name containing " + name + " not found!");
        }

    };

    /* ========== SEASONS HANDLING ============= */
    RowManager.seasons = {};
    RowManager.seasons.clickCell = function($row) {
        $row = $($row);
        $row.find(".season-cell").click();
    };

    RowManager.seasons.select = function(optionNumber) {
        var $select =  $($(".x-select-season")[0]);
        var $option = $($select.find("option")[optionNumber]);

        $option.attr("selected", "selected");
        $select.trigger("change");
    };

    /* ========== EPISODES HANDLING ============= */
    RowManager.episodes = {};
    RowManager.episodes.clickCell = function($row) {
        $row = $($row);
        $row.find(".episodes-cell").click();
    };

    RowManager.episodes.select = function(absoluteEpisodeNumber) {

        var number = "(" + absoluteEpisodeNumber + ")";
        $(".select-episode-row").each(function(){
            var $this = $(this);
            var text = $this.find(".episode-number-cell").html();
            if(text.includes(number)) {
                $this.find(".select-row-cell input[type=checkbox]").click();
                return false;
            }
        });
        $("button.x-select").click();
    };

    /* ================== FUNCTION MANAGEMENT ======================== */

    var FunctionManager = {};
    FunctionManager.paused = false;
    FunctionManager.funcs = [];
    FunctionManager.interval = 2 * 1000;
    FunctionManager.push = function(method, parameters) {
        this.funcs.push({method: method, parameters: parameters});
    };

    FunctionManager.init = function() {
        var that = this;
        setInterval(function(){ that.executeNext(); }, that.interval);
    };

    FunctionManager.executeNext = function() {
        if(this.paused) return;
        if(this.funcs .length === 0) return;
        var func = this.funcs.shift();
        func.method(func.parameters);
    };

    FunctionManager.pause = function() {
        this.paused = true;
        UI.updatePauseContinueButton();
    };

    FunctionManager.togglePause = function() {
        this.paused = !this.paused;
        UI.updatePauseContinueButton();
    };
    FunctionManager.continue = function() {
        this.paused = false;
        UI.updatePauseContinueButton();
    };
    FunctionManager.stop = function() {
        this.funcs = [];
        this.paused = false;
        UI.updatePauseContinueButton();
        TaskExecutor.clean();
    };

    window.FunctionManager = FunctionManager;

    /* ================== INITIALIZATION =============================*/

    var TaskExecutor = {};

    TaskExecutor.totalTasks = 0;
    TaskExecutor.processedTasks = 0;
    TaskExecutor.selectSeason = function(serie, seasonOptionNumber, startEpisodeNumber) {
        var rows = RowManager.getRows();
        var that = this;
        that.clean();
        rows.forEach(row => {
            that.executeRow(row, serie, seasonOptionNumber, startEpisodeNumber);
            startEpisodeNumber++;
            that.totalTasks++;
        });
        UI.updateBotTotalCount();
    };

    TaskExecutor.executeRow = function($row, serie, seasonOptionNumber, episodeNumber) {
        console.log("Executing " + serie + ": S" +  seasonOptionNumber + "E" + episodeNumber);
        $row = $($row);
        FunctionManager.push(RowManager.series.clickCell, $row);
        FunctionManager.push(RowManager.series.select, serie);
        FunctionManager.push(RowManager.seasons.clickCell, $row);
        FunctionManager.push(RowManager.seasons.select, seasonOptionNumber);
        FunctionManager.push(RowManager.episodes.clickCell, $row);
        FunctionManager.push(RowManager.episodes.select, episodeNumber);
        FunctionManager.push(function() {TaskExecutor.processedTasks--; UI.updateBotTotalCount()});
        TaskExecutor.processedTasks++;
    };

    TaskExecutor.clean = function() {
        TaskExecutor.totalTasks = 0;
        TaskExecutor.processedTasks = 0;
        UI.updateBotTotalCount();
    }
    window.TaskExecutor = TaskExecutor;

    FunctionManager.init();

    /* ================== UI MANAGEMENT =============================*/

    var UI = {};

    UI.interval = 1000;
    UI.init = function() {
        var that = this;

        setInterval(function(){ that.addSeriesManagement(); }, that.interval);
    };
    UI.isImportModalPresent = function() {
        return $(".manual-import-modal .select-all-header-cell").length > 0;
    };

    UI.areKiriosFeaturesPresent = function() {
        return $("#kiriosFeatures").length > 0;
    };
    UI.addSeriesManagement = function() {
        if(!this.isImportModalPresent() || this.areKiriosFeaturesPresent()) return;
        var that = this;
        var $body = $(".modal-body");
        FunctionManager.stop();
        $body.prepend(`<div class="row" id="kiriosFeatures" style="margin-left: 0; margin-right: 0;">
    <div class="col-sm-3">
        <div class="row">
          <div class="col-12">
            <button type="button" class="btn btn-default" id="btnSelectValid">Select valid</button>
            <button type="button" class="btn btn-default" id="btnSelectInvalid">Select invalid</button>
          </div>
        </div>
        <div class="row" style="margin-top: 10px">
          <div class="col-12">
            <button type="button" class="btn btn-default" id="btnToggleUnselected">Hide/Show Unselected</button>
          </div>
        </div>
    </div>
    <div class="col-sm-9">
        <div class="form-horizontal">
            <div class="form-group">
                <label for="txtSerie" class="col-sm-2 control-label">Serie</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="txtSerie" placeholder="Serie"> </div>
            </div>
            <div class="form-group">
                <label for="txtSeason" class="col-sm-2 control-label">Season</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="txtSeason" placeholder="Season"> </div>
            </div>
            <div class="form-group">
                <label for="txtEpisode" class="col-sm-2 control-label">Episode</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="txtEpisode" placeholder="1"> </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-2"></div>
            <div class="col-sm-9">
                <button type="button" class="btn btn-success" id="btnStart">Start Bot</button>
                <button type="button" class="btn btn-warning" id="btnPause">Pause</button>
                <button type="button" class="btn btn-danger" id="btnStop">Stop</button>
            </div>
            <div class="col-sm-1"><span id="botTotalCount"></span></div>
        </div>
    </div>
</div>`);

        $("#btnSelectValid").click(SelectionManager.checkAllValid);
        $("#btnSelectInvalid").click(SelectionManager.checkAllInvalid);
        $("#btnToggleUnselected").click(SelectionManager.toggleUnselected);
        $("#btnStart").click(that.startBot);
        $("#btnPause").click(function() {FunctionManager.togglePause(); });
        $("#btnStop").click(function() {FunctionManager.stop(); });
    };

    UI.updateBotTotalCount = function() {
        var left = TaskExecutor.totalTasks - TaskExecutor.processedTasks;
        $("#botTotalCount").html(left + "/" + TaskExecutor.totalTasks);
    };

    UI.updatePauseContinueButton = function() {
        var button = $("#btnPause");
        if(FunctionManager.paused) {
            button.html("Continue");
        }
        else {
            button.html("Pause");
        }
    };

    UI.startBot = function() {
        var serie =  $("#txtSerie").val();
        var seasonOptionNumber = $("#txtSeason").val();
        var startEpisodeNumber = $("#txtEpisode").val();
        if(!serie || !seasonOptionNumber || !startEpisodeNumber){
            alert("Must complete all");
            return;
        }
        TaskExecutor.selectSeason(serie, seasonOptionNumber, startEpisodeNumber);
    };
    window.UI = UI;

    UI.init();

    $(document).keydown(function(e) {
        if (e.keyCode == 27) return false;
    });

    $(document).on("click", ".select-row-cell", function() {
        $(this).find("input[type=checkbox]").click();
    });
    $(document).on("click", ".select-row-cell input[type=checkbox]", function(e) {
        e.stopPropagation();
    });
})();

function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

addGlobalStyle ( `
    .manual-import-row td {
        border-right: 1px #ddd solid;
        border-left: 1px #ddd solid;
    }
    .manual-import-row td:hover {
        background-color: #e8e8e8;
        cursor: pointer;
    }
` );
