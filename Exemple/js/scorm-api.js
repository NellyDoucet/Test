/* Moteur API SCORM 1.2. Recherche l'API LMS dans les fenetres parentes,
   expose les appels LMSInitialize/LMSSetValue/LMSGetValue/LMSCommit/LMSFinish
   et bascule en mode local (sans LMS) pour la previsualisation hors ligne. */

(function (global) {
  "use strict";

  var MAX_SEARCH_DEPTH = 500;

  var ScormAPI = {
    api: null,
    isInitialized: false,
    isLocalMode: false,
    localStore: {},

    findAPI: function (win) {
      var depth = 0;
      while (win.API == null && win.parent != null && win.parent !== win && depth < MAX_SEARCH_DEPTH) {
        depth += 1;
        win = win.parent;
      }
      return win.API || null;
    },

    locateAPI: function () {
      var found = null;

      if (global.opener != null && typeof global.opener !== "undefined") {
        found = this.findAPI(global.opener);
      }

      if (found == null) {
        found = this.findAPI(global);
      }

      return found;
    },

    initialize: function () {
      this.api = this.locateAPI();

      if (this.api == null) {
        this.isLocalMode = true;
        this.isInitialized = true;
        this.loadLocalStore();
        console.warn("[SCORM] Aucun LMS detecte. Mode local active pour previsualisation.");
        return true;
      }

      var result = this.api.LMSInitialize("");
      this.isInitialized = result === "true" || result === true;

      if (!this.isInitialized) {
        console.warn("[SCORM] Echec de LMSInitialize.", this.getLastErrorInfo());
      }

      return this.isInitialized;
    },

    setValue: function (key, value) {
      if (this.isLocalMode) {
        this.localStore[key] = value;
        this.saveLocalStore();
        return true;
      }

      if (!this.isInitialized || this.api == null) {
        return false;
      }

      var result = this.api.LMSSetValue(key, value);
      return result === "true" || result === true;
    },

    getValue: function (key) {
      if (this.isLocalMode) {
        return this.localStore.hasOwnProperty(key) ? this.localStore[key] : "";
      }

      if (!this.isInitialized || this.api == null) {
        return "";
      }

      return this.api.LMSGetValue(key);
    },

    commit: function () {
      if (this.isLocalMode) {
        this.saveLocalStore();
        return true;
      }

      if (!this.isInitialized || this.api == null) {
        return false;
      }

      var result = this.api.LMSCommit("");
      return result === "true" || result === true;
    },

    finish: function () {
      if (this.isLocalMode) {
        this.saveLocalStore();
        this.isInitialized = false;
        return true;
      }

      if (!this.isInitialized || this.api == null) {
        return false;
      }

      var result = this.api.LMSFinish("");
      this.isInitialized = false;
      return result === "true" || result === true;
    },

    getLastErrorInfo: function () {
      if (this.isLocalMode || this.api == null) {
        return null;
      }

      var code = this.api.LMSGetLastError();
      var text = this.api.LMSGetErrorString(code);
      var diagnostic = this.api.LMSGetDiagnostic(code);

      return { code: code, text: text, diagnostic: diagnostic };
    },

    saveLocalStore: function () {
      try {
        global.localStorage.setItem("scorm_local_store", JSON.stringify(this.localStore));
      } catch (error) {
        console.warn("[SCORM] Impossible d'enregistrer le stockage local.", error);
      }
    },

    loadLocalStore: function () {
      try {
        var raw = global.localStorage.getItem("scorm_local_store");
        this.localStore = raw ? JSON.parse(raw) : {};
      } catch (error) {
        this.localStore = {};
      }
    },

    setStatus: function (status) {
      return this.setValue("cmi.core.lesson_status", status);
    },

    getStatus: function () {
      var status = this.getValue("cmi.core.lesson_status");
      return status || "not attempted";
    },

    setScore: function (raw, min, max) {
      this.setValue("cmi.core.score.raw", String(raw));
      this.setValue("cmi.core.score.min", String(min != null ? min : 0));
      this.setValue("cmi.core.score.max", String(max != null ? max : 100));
    },

    setSuspendData: function (data) {
      var serialized = typeof data === "string" ? data : JSON.stringify(data);
      return this.setValue("cmi.suspend_data", serialized);
    },

    getSuspendData: function () {
      var raw = this.getValue("cmi.suspend_data");
      if (!raw) {
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch (error) {
        return null;
      }
    },

    setSessionTime: function (seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds % 3600) / 60);
      var secs = Math.floor(seconds % 60);
      var pad = function (n) {
        return String(n).padStart(2, "0");
      };
      var formatted = pad(hours) + ":" + pad(minutes) + ":" + pad(secs) + ".00";
      return this.setValue("cmi.core.session_time", formatted);
    }
  };

  global.ScormAPI = ScormAPI;
})(window);
